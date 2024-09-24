from django.urls import path
from . import views


urlpatterns = [
    path('register/', views.UserRegisterView.as_view(), name='user-create'),
    path('logout/', views.UserLogoutView.as_view(), name='user-logout'),
    path('update/', views.UserUpdateView.as_view(), name='user-update'),
]