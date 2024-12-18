from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Book, Category



class BookSerializer(ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    category = serializers.SlugRelatedField(slug_field='name', queryset=Category.objects.all())
    owner_phone_number = serializers.CharField(source='get_owner_phone_number', read_only=True)


    class Meta:
        model = Book
        fields = ['id', 'title', 'authors', 'owner', 'publisher', 'image', 'active', 'created_at', 'category', 'is_approved', 'owner_phone_number']
        extra_kwargs = {'owner': {'read_only': True}, 'is_approved': {'read_only': True}}

    def create(self, validated_data):
        validated_data['active'] = True
        validated_data['owner'] = self.context['request'].user
        print(validated_data)
        return super().create(validated_data)