# models.py
from django.db import models
from users.models import User

class ChatRoom(models.Model):
    participants = models.ManyToManyField(User, related_name='chatrooms')
    created_at = models.DateTimeField(auto_now_add=True)

    @classmethod
    def get_or_create_room(cls, user1, user2):
        room, created = cls.objects.get_or_create(
            participants__in=[user1, user2],
            participants__count=2
        )
        if created:
            room.participants.add(user1, user2)
        return room

    def __str__(self):
        return f"ChatRoom {self.id}"

class Message(models.Model):
    chatroom = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message {self.id} from {self.sender.username}"
