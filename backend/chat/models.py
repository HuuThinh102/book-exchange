from django.db import models
from users.models import User

class ChatRoom(models.Model):
    participants = models.ManyToManyField(User, related_name='chatrooms')
    created_at = models.DateTimeField(auto_now_add=True)

    @classmethod
    def get_or_create_room(cls, user1, user2):
        # Create a unique room name based on user IDs
        room_name = f"chat_{min(user1.id, user2.id)}_{max(user1.id, user2.id)}"
        room, created = cls.objects.get_or_create(name=room_name)
        room.participants.add(user1, user2)
        return room
    
    def __str__(self):
        return f"Room {self.id}"

class Message(models.Model):
    chatroom = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message {self.id} from {self.sender.username}"