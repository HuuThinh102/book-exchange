from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('books', views.BookViewSet)



urlpatterns = [
    path('', include(router.urls)),
    path('users/my-books/', views.UserBookListView.as_view(), name='user-books'),
]