from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.core.cache import cache
from core.auth.permissions import UserPermission
from core.abstract.viewsets import AbstractViewSet
from django.shortcuts import get_object_or_404
from rest_framework import viewsets

from core.content.serializers import (
    PostUserSerializer, PostPeerSerializer,
    #GeneralPostSerializer,
     PostServiceSerializer,
    CommentSerializer
    )

from core.content.models import (
    PostPeer, PostUser, GeneralPost,
    PostService, Comment
    )


from rest_framework.response import Response
from rest_framework.response import Response
from rest_framework import status
from .models import GeneralPost, PostService, PostPeer, PostUser
from .serializers import PostServiceSerializer, PostPeerSerializer, PostUserSerializer

class GeneralPostViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = GeneralPost.objects.all().order_by("created")
        posts_user, posts_peer, posts_service = [], [], []

        for general_post in queryset:
            post_service = PostService.objects.filter(public_id=general_post.public_id).first()
            post_peer = PostPeer.objects.filter(public_id=general_post.public_id).first()
            post_user = PostUser.objects.filter(public_id=general_post.public_id).first()

            if post_peer:
                posts_peer.append(post_peer)
            if post_user:
                posts_user.append(post_user) 
            if post_service:
                posts_service.append(post_service)

        print(posts_peer)
        post_peer_serializer = PostPeerSerializer(posts_peer, many=True)
        post_user_serializer = PostUserSerializer(posts_user, many=True)
        post_service_serializer = PostServiceSerializer(posts_service, many=True) 

        peer_data = post_peer_serializer.data
        user_data = post_user_serializer.data
        service_data = post_service_serializer.data

        return Response({"post_peers": peer_data, "post_users": user_data, "post_services": service_data})
        # else:
        #     return Response({"message": "No specific posts found"}, status=status.HTTP_404_NOT_FOUND)


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
        return Comment.objects.all()

    def get_object(self):
        obj = Comment.objects.get_object_by_public_id(self.kwargs["pk"])

        self.check_object_permissions(self.request, obj)

        return obj