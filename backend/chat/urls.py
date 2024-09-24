from django.urls import path
from . import views

urlpatterns = [
    path('messages/', views.MessageViewSet.as_view({'post': 'create'}), name='send-message'),
    path('messages/received/', views.MessageViewSet.as_view({'get': 'received_messages'}), name='received-messages'),
]
