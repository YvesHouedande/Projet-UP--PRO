from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from core.abstract.viewsets import AbstractViewSet
from core.request.models import Request
from core.request.serializers import RequestSerializer
from core.auth.permissions import UserPermission
from rest_framework import filters
from django_filters import rest_framework as django_filters

class RequestViewSet(AbstractViewSet):
    http_method_names = ('post', 'get', 'put', 'delete')
    permission_classes = (UserPermission,)
    serializer_class = RequestSerializer
    filter_backends = [filters.SearchFilter, django_filters.DjangoFilterBackend]
    search_fields = ['name', 'description']
    # filterset_fields = {
    #     'type': ['exact'],
    #     'status': ['exact'],
    #     'created': ['gte', 'lte']
    # }
    ordering_fields = ['created', 'handled_at', 'status']
    ordering = ['-created']

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Request.objects.all()
        return Request.objects.filter(requester=user)

    @action(detail=True, methods=['put'])
    def handle_request(self, request, pk=None):
        """
        Action pour gérer une demande (approuver/rejeter)
        """
        if not request.user.is_superuser:
            return Response(
                {"detail": "Vous n'avez pas la permission d'effectuer cette action"},
                status=status.HTTP_403_FORBIDDEN
            )

        instance = self.get_object()
        new_status = request.data.get('status')
        comment = request.data.get('comment', '')
        
        if new_status not in ['approved', 'rejected']:
            return Response(
                {"detail": "Statut invalide"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mise à jour du statut et des informations de traitement
        instance.status = new_status
        instance.handled_by = request.user
        instance.handled_at = timezone.now()
        
        
        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Statistiques sur les demandes (admin uniquement)
        """
        if not request.user.is_superuser:
            return Response(
                {"detail": "Accès non autorisé"},
                status=status.HTTP_403_FORBIDDEN
            )

        queryset = Request.objects.all()
        stats = {
            'total': queryset.count(),
            'pending': queryset.filter(status='pending').count(),
            'approved': queryset.filter(status='approved').count(),
            'rejected': queryset.filter(status='rejected').count(),
            'by_type': {
                'promotion': queryset.filter(type='promotion').count(),
                'service': queryset.filter(type='service').count(),
            }
        }
        return Response(stats)
