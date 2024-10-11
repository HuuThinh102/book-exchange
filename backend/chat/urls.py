from django.urls import path
from .views import CreateChatRoomView, SendMessageView, ReceiveMessagesView

urlpatterns = [
    path('', CreateChatRoomView.as_view(), name='create-chatroom'),
    path('messages/', SendMessageView.as_view(), name='send-message'),
    path('messages/received/<int:chatroom_id>/', ReceiveMessagesView.as_view(), name='receive-messages'),
]
