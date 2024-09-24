from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from django.utils.translation import gettext_lazy as _

class UserCustomAdmin(UserAdmin):
    list_display = ('username', 'phone_number')
    search_fields = ('username', 'phone_number')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.exclude(is_superuser=True)
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {
            'fields': ('phone_number',),
        }),
    )


admin.site.register(User, UserCustomAdmin)
