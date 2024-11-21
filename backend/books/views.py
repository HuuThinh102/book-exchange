from .models import Book
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializer import BookSerializer
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.exceptions import PermissionDenied
import logging
from rapidfuzz import fuzz
from unidecode import unidecode

logger = logging.getLogger(__name__)

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.filter(active=True).order_by('-created_at')
    serializer_class = BookSerializer
    parser_classes = [JSONParser, MultiPartParser]

    def get_queryset(self):
        if self.action in ['list', 'retrieve', 'by_category']:
            return Book.objects.filter(active=True, is_approved=True).order_by('-created_at')
        return Book.objects.all()


    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'search', 'by_category']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, is_approved=False, active=False)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category_id = request.query_params.get('category_id')
        if category_id:
            books = Book.objects.filter(category_id=category_id, active=True, is_approved=True).order_by('-created_at')[:10]
            serializer = BookSerializer(books, many=True, context={'request': request})
            return Response(serializer.data)
        return Response({"error": "Category ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    
    def create(self, request, *args, **kwargs):
        logger.info(f"Request data: {request.data}")
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error occurred: {str(e)}")
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
            normalized_query = unidecode(query).lower()
            books = Book.objects.filter(is_approved=True)
            book_scores = []

            for book in books:
                # Compute similarity scores for title and authors
                title_score = fuzz.partial_ratio(normalized_query, unidecode(book.title).lower())
                author_score = fuzz.partial_ratio(normalized_query, unidecode(book.authors).lower())
                max_score = max(title_score, author_score)
                book_scores.append((book, max_score))
            
            # Sort books by score in descending order and filter by threshold
            sorted_books = sorted(book_scores, key=lambda x: x[1], reverse=True)
            filtered_books = [book[0] for book in sorted_books if book[1] >= 75]

            # Serialize and return the results
            serializer = BookSerializer(filtered_books, many=True, context={'request': request})
            similarity_scores = [score for _, score in book_scores]
            print(f"Similarity Scores: {similarity_scores}")
            return Response(serializer.data)
        
        return Response({"error": "No query provided"}, status=400)

class UserBookListView(generics.ListAPIView):
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Book.objects.filter(owner=self.request.user).order_by('-created_at')