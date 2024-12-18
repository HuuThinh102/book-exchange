# Generated by Django 5.1 on 2024-10-14 14:10

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chatroom',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='message',
            name='chatroom',
        ),
        migrations.AddField(
            model_name='chatroom',
            name='name',
            field=models.CharField(default=None, max_length=255),
        ),
        migrations.AddField(
            model_name='message',
            name='room',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='chat.chatroom'),
        ),
        migrations.AlterField(
            model_name='chatroom',
            name='participants',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='message',
            name='sender',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
