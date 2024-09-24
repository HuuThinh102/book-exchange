from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Book, Category



class BookSerializer(ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    class Meta:
        model = Book
        fields = ['id', 'title', 'authors', 'owner', 'description', 'publisher', 'image', 'status', 'active', 'created_at', 'category', 'is_approved']
        extra_kwargs = {'owner': {'read_only': True}, 'is_approved': {'read_only': True}}

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)