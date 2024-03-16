from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.core.cache import cache
from core.auth. permissions import UserPermission
from core.abstract.viewsets import AbstractViewSet

from core.content.serializers import (
    PostUserSerializer, PostPeerSerializer,
    GeneralPostSerializer, PostServiceSerializer,
    CommentSerializer
    )

from core.content.models import (
    PostPeer, PostUser, GeneralPost,
    PostService,
    )



class GeneralPostViewSet(AbstractViewSet):
    http_method_names = ("get")
    permission_classes = (UserPermission,)
    serializer_class = GeneralPostSerializer
    filterset_fields = [ "updated"]

    def get_queryset(self):
        return GeneralPost.objects.all()

    def get_object(self):
        obj = GeneralPost.objects.get_object_by_public_id(self.kwargs["pk"])

        self.check_object_permissions(self.request, obj)

        return obj
    
###################### PostUserViewSet 
class PostUserViewSet(AbstractViewSet):
    http_method_names = ("post", "get",  "delete")
    permission_classes = (UserPermission,)
    serializer_class = PostUserSerializer
    filterset_fields = [ "updated"]

    def get_queryset(self):
        return PostUser.objects.all()

    def get_object(self):
        obj = PostUser.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

    def list(self, request, *args, **kwargs):
        # Cache to manage
        #Pagination to manage
        post_objects = self.filter_queryset(self.get_queryset())
            
        if request.user.is_authenticated:
            serializer = self.get_serializer(post_objects, many=True)
            return Response(serializer.data)
        return Response({"nothing to see":""})
   
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
    

###################### PostPeerviewSet
class PostPeerViewSet(AbstractViewSet):
    http_method_names = ("post", "get",  "delete", "put")
    permission_classes = (UserPermission,)
    serializer_class = PostPeerSerializer
    filterset_fields = ["updated"]

    def get_queryset(self):
        return PostPeer.objects.all()

    def get_object(self):
        obj = PostPeer.objects.get_object_by_public_id(self.kwargs["pk"])

        self.check_object_permissions(self.request, obj)

        return obj


###################### PostServiceViewSet
class PostServiceViewSet(AbstractViewSet):
    http_method_names = ("post", "get",  "delete", "patch")
    permission_classes = (UserPermission,)
    serializer_class = PostServiceSerializer
    filterset_fields = ["updated"]

    def get_queryset(self):
        return PostService.objects.all()

    def get_object(self):
        obj = PostService.objects.get_object_by_public_id(self.kwargs["pk"])

        self.check_object_permissions(self.request, obj)

        return obj



###################### CommentViewset
class CommentViewset(AbstractViewSet):
    http_method_names = ("post", "get",  "delete", "put")
    permission_classes = (UserPermission,)
    serializer_class = CommentSerializer
    filterset_fields = ["updated"]

    def get_queryset(self):
        return PostUser.objects.all()

    def get_object(self):
        obj = PostUser.objects.get_object_by_public_id(self.kwargs["pk"])

        self.check_object_permissions(self.request, obj)

        return obj