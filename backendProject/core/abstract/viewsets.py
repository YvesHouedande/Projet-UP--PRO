from rest_framework import viewsets
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django_filters.rest_framework import DjangoFilterBackend


class AbstractViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, OrderingFilter, ]  
    ordering_fields = ["updated", "created"]  # Champs disponibles pour le tri: url ...
    ordering = ["-updated"]  # Ordre de tri par défaut (du plus récent au plus ancien)