from operator import pos
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from core.author.models import User
from core.auth.permissions import UserPermission
from core.abstract.viewsets import AbstractViewSet
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache

from core.content.serializers import (
    EventSerializer, CommentSerializer
    )

from core.content.models import (
    Comment, Event
    )

from rest_framework import status
from .models import  GeneralPost
from .serializers import GeneralPostSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters

class GeneralPostViewSet(AbstractViewSet):
    http_method_names = ("post", "get", "patch") 
    permission_classes = [IsAuthenticated, UserPermission]
    serializer_class = GeneralPostSerializer

    def get_queryset(self):
        user_pk = self.kwargs.get("user__pk")  # Correction de la clé ici
        if user_pk:
            try:
                user = User.objects.get(public_id=user_pk)
            except User.DoesNotExist:
                return GeneralPost.objects.none()
            return GeneralPost.objects.filter(author=user)
        return GeneralPost.objects.all()

    def get_object(self):
        obj = GeneralPost.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

    def list(self, request, *args, **kwargs):
        # post_objects = cache.get("post_objects")
        post_objects = None

        if post_objects is None:
            print('---------------------requête sur la base de données -----------------------')
            post_objects = self.filter_queryset(self.get_queryset())
            cache.delete("post_objects")
            # cache.set("post_objects", post_objects)

            
        page = self.paginate_queryset(post_objects)
        if page is not None: 
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(post_objects, many=True)
        return Response(serializer.data)
   
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=["get"], detail=True)
    def like(self, request, *args, **kwargs):
        post = self.get_object()
        user = self.request.user
        user.like_post(post)

        serializer = self.serializer_class(post, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["get"], detail=True)
    def remove_like(self, request, *args, **kwargs):
        post = self.get_object()
        user = self.request.user

        user.unlike_post(post)

        serializer = self.serializer_class(post, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    

###################### CommentViewset
class CommentViewset(AbstractViewSet):
    http_method_names = ("post", "get",  "delete", "put")
    permission_classes = (UserPermission,)
    serializer_class = CommentSerializer
    # filterset_fields = ["updated"]

    def get_queryset(self):
        post_pk = self.kwargs.get("post__pk")
        if post_pk :
            return Comment.objects.filter(post__public_id=post_pk)
        return Comment.objects.all()

    def get_object(self):
        obj = Comment.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    


from rest_framework.exceptions import NotFound
class EventViewSet(AbstractViewSet):
    """
    A ViewSet for viewing and editing event instances.
    
    - Inherits from ViewSet to provide standard CRUD operations.
    - Uses search filters to enable searching on specified fields.
    """
    http_method_names = ["post", "get", "delete", 'patch']
    permission_classes = [UserPermission]
    filter_backends = [filters.SearchFilter]
    serializer_class = EventSerializer
    search_fields = ['label', 'service__label', 'description']

    def get_queryset(self):
        service_pk = self.kwargs.get("service__pk")
        user_pk = self.kwargs.get("user__pk")  # Corrected key
        if user_pk:
            try:
                user = User.objects.get(public_id=user_pk)
            except User.DoesNotExist:
                return Event.objects.none()
            return Event.objects.filter(service__manager__public_id=user_pk)

        if service_pk:
            return Event.objects.filter(service__public_id=service_pk) 

        return Event.objects.all()

    def get_object(self):
        obj = Event.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def delete(self, request, *args, **kwargs):
        """
        Supprimer un événement via son `public_id`.
        """
        try:
            event = self.get_object()
        except Event.DoesNotExist:
            raise NotFound({"detail": "Événement non trouvé."})

        # Vérification des permissions de l'utilisateur pour supprimer l'événement
        self.check_object_permissions(request, event)

        # Suppression de l'événement
        event.delete()
        return Response({"detail": "Événement supprimé avec succès."}, status=status.HTTP_204_NO_CONTENT)

