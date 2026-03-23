from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ('username', 'email', 'first_name', 'last_name',
                     'role', 'is_active', 'date_joined')
    list_filter   = ('role', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering      = ('-date_joined',)

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role & Access', {
            'fields': ('role',),
            'description': (
                '<strong>Admin</strong> — full access: create/edit/delete '
                'campaigns, templates, courses, targets, settings.<br>'
                '<strong>HR (View Only)</strong> — read-only access to: '
                'Dashboard, Campaign table (no action buttons), '
                'Analytics &amp; Reports, Account profile.'
            ),
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Role & Access', {
            'fields': ('role', 'email', 'first_name', 'last_name'),
        }),
    )
