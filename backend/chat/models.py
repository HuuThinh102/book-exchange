from django.db import models
from django.contrib.auth import get_user_model
from users.models import User

class ChatRoom(models.Model):
    name = models.CharField(max_length=255, default=None)
    participants = models.ManyToManyField(User)

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, default=None)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
