from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import ChatRoom, Message
from .serializer import ChatRoomSerializer, MessageSerializer
from users.models import User
from rest_framework.exceptions import ValidationError


class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Chỉ hiển thị những phòng chat mà người dùng đã tham gia
        return ChatRoom.objects.filter(participants=self.request.user)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        chat_room = self.get_object()
        messages = Message.objects.filter(room=chat_room).order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def create_chat_room(self, request):
        user_id = request.data.get('user_id')
        try:
            user_to_chat = User.objects.get(id=user_id)
            # Kiểm tra xem phòng chat đã tồn tại hay chưa
            chat_room = ChatRoom.objects.filter(participants=request.user).filter(participants=user_to_chat).first()
            if chat_room:
                return Response({"message": "Phòng chat đã tồn tại."})
            # Nếu chưa có thì tạo phòng chat mới
            chat_room = ChatRoom.objects.create()
            chat_room.participants.add(request.user, user_to_chat)
            chat_room.save()
            return Response(ChatRoomSerializer(chat_room).data)
        except User.DoesNotExist:
            return Response({"error": "Người dùng không tồn tại"}, status=400)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        recipient_id = request.data.get('recipient_id')
        message_text = request.data.get('message')
        if not recipient_id or not message_text:
            raise ValidationError("Recipient ID và message không được để trống.")
        try:
            recipient = User.objects.get(id=recipient_id)
            chatroom = ChatRoom.objects.filter(participants=request.user).filter(participants=recipient).first()
            if not chatroom:
                chatroom = ChatRoom.objects.create()
                chatroom.participants.add(request.user, recipient)
                chatroom.save()
            message = Message.objects.create(
                chatroom=chatroom,
                sender=self.request.user,
                content=message_text
            )
            return Response(MessageSerializer(message).data)
        except User.DoesNotExist:
            return Response({"error": "Người nhận không tồn tại."}, status=400)
    
    @action(detail=False, methods=['get'])
    def received_messages(self, request):
        user = request.user
        chatrooms = ChatRoom.objects.filter(participants=user)
        messages = Message.objects.filter(chatroom__in=chatrooms).exclude(sender=user).order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

