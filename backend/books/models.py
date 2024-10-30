from django.db import models
from users.models import User


# Category model: Truong CNTT&TT, Truong Kinh te,....
class Category(models.Model):
    name = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    authors = models.TextField(default=None)
    publisher = models.CharField(max_length=150, default=None)
    image = models.ImageField(upload_to='books/%Y/%m/', default=None)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='books')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
          
