from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ChatRoom, Message
from .serializer import MessageSerializer
from users.models import User

class CreateChatRoomView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user1 = request.user
        user2_id = request.data.get('recipient_id')
        user2 = User.objects.get(id=user2_id)
        chatroom = ChatRoom.get_or_create_room(user1, user2)
        return Response({'id': chatroom.id})

class SendMessageView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        chatroom_id = self.request.data.get('chatroom_id')
        chatroom = ChatRoom.objects.get(id=chatroom_id)
        serializer.save(sender=self.request.user, chatroom=chatroom)

class ReceiveMessagesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        chatroom_id = self.kwargs['chatroom_id']
        return Message.objects.filter(chatroom_id=chatroom_id)
