from .models import Book
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializer import BookSerializer
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.filter(active=True, is_approved=True)
    serializer_class = BookSerializer
    parser_classes = [JSONParser, MultiPartParser]

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'search']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, is_approved=False)
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def update(self, request, *args, **kwargs):
        book = self.get_object()
        if book.owner != request.user:
            raise PermissionDenied("You do not have permission to update this book.")
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        book = self.get_object()
        if book.owner != request.user:
            raise PermissionDenied("You do not have permission to partially update this book.")
        return super().partial_update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        book = self.get_object()
        if book.owner != request.user:
            raise PermissionDenied("You do not have permission to delete this book.")
        return super().destroy(request, *args, **kwargs)

    @action(methods=['post'], detail=True)
    def hide_book(self, request, pk):
        try:
            book = Book.objects.get(pk=pk)
            book.active = False
            book.save()
            return Response(data=BookSerializer(book, context={'request': request}).data, status=status.HTTP_200_OK)
        except Book.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', None)
        if query:
            words = query.split()
            filters = Q(active=True, is_approved=True)
            for word in words:
                filters &= Q(title__icontains=word)
            books = Book.objects.filter(filters)
            serializer = BookSerializer(books, many=True, context={'request': request})
            return Response(serializer.data)
        return Response({"error": "No query provided"}, status=400)

class UserBookListView(generics.ListAPIView):
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Book.objects.filter(owner=self.request.user)