from django.contrib import admin
from .models import Book, Category

class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'is_approved', 'created_at')
    search_fields = ('title', 'owner__username')
    list_filter = ('owner__username', 'is_approved')

    actions = ['approve_books']

    def approve_books(self, request, queryset):
        queryset.update(is_approved=True)

class CategoryAdmin(admin.ModelAdmin):
    search_fields = ('name',)

admin.site.register(Book, BookAdmin)
admin.site.register(Category, CategoryAdmin)
