from django.contrib import admin
from core.request.models import Request

@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = (
        'name', 
        'type', 
        'status', 
        'requester', 
        'handled_by', 
        'created', 
        'handled_at'
    )
    list_filter = ('type', 'status', 'created', 'handled_at')
    search_fields = ('name', 'description', 'requester__email', 'handled_by__email')
    readonly_fields = ('public_id', 'created', 'updated')
    ordering = ('-created',)
    date_hierarchy = 'created'

    fieldsets = (
        ('Informations générales', {
            'fields': ('public_id', 'name', 'type', 'description')
        }),
        ('Statut', {
            'fields': ('status',)
        }),
        ('Relations', {
            'fields': ('requester', 'handled_by')
        }),
        ('Dates', {
            'fields': ('handled_at', 'created', 'updated')
        }),
    )

    def has_add_permission(self, request):
        # Seuls les administrateurs peuvent créer des demandes depuis l'admin
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        # Seuls les administrateurs peuvent modifier les demandes
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        # Seuls les administrateurs peuvent supprimer les demandes
        return request.user.is_superuser 