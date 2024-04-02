from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.core.cache import cache
from core.auth.permissions import UserPermission
from core.abstract.viewsets import AbstractViewSet
from rest_framework import viewsets

from core.content.serializers import (
    PostUserSerializer, PostPeerSerializer,
     PostServiceSerializer,
    CommentSerializer
    )

from core.content.models import (
    PostPeer, PostUser, GeneralPost,
    PostService, Comment
    )

from core.author.serializers import UserSerializer

from rest_framework.response import Response
from rest_framework.response import Response
from rest_framework import status
from .models import GeneralPost, PostService, PostPeer, PostUser
from .serializers import PostServiceSerializer, PostPeerSerializer, PostUserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

# class GeneralPostViewSet(viewsets.ViewSet):
#     permission_classes = [IsAuthenticated] 
#     def list(self, request):
#         queryset = GeneralPost.objects.all().order_by("-created")
#         queryset_data = []
#         print((request.user.P_followed_by.all()))

#         for general_post in queryset:
#             data = {}

#             post_service = PostService.objects.filter(public_id=general_post.public_id).first()
#             post_peer = PostPeer.objects.filter(public_id=general_post.public_id).first()
#             post_user = PostUser.objects.filter(public_id=general_post.public_id).first()

#             if post_peer:
#                 serializer = PostPeerSerializer(post_peer)
#                 data.update(serializer.data)
#                 data["type"] = post_peer.post_type()
#             elif post_user:
#                 serializer = PostUserSerializer(post_user)
#                 data.update(serializer.data)
#                 data["type"] = post_user.post_type()
#             elif post_service:
#                 serializer = PostServiceSerializer(post_service)
#                 data.update(serializer.data)
#                 data["type"] = post_service.post_type()

#             queryset_data.append(data)

#         return Response(queryset_data) 
        
class GeneralPostViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        queryset_service = PostService.objects.filter(service__follows=request.user)

        filter_value = request.query_params.get('filter')
        if filter_value == "administration":
            ad_posts = sorted(queryset_service, key=lambda x: x.post_type()=="Administration", reverse=True)
            posts_count = len(ad_posts) 

            posts_data = PostServiceSerializer(ad_posts, many=True, context={'request': request}).data
            for post_data in posts_data:
                post_data["author"] = UserSerializer(request.user, context={'request': request}).data

            return Response({"posts_count": posts_count, "posts": posts_data}) 
        
        #if not filter for important post, so we get other data from db
        queryset_user = PostUser.objects.filter(author__follows=request.user)
        queryset_peer = PostPeer.objects.filter(peer__follows=request.user)

        all_querysets = list(queryset_user) + list(queryset_service) + list(queryset_peer)
        if filter_value == "popular":
            all_posts = [x for x in all_querysets if x.is_popular()]
        else:
            all_posts = sorted(all_querysets, key=lambda x: x.created, reverse=True)

        queryset_data = []
        for post in all_posts:
            serializer = None
            if isinstance(post, PostUser):
                serializer = PostUserSerializer(post, context={'request': request})
            elif isinstance(post, PostService):
                serializer = PostServiceSerializer(post)
            elif isinstance(post, PostPeer):
                serializer = PostPeerSerializer(post)
            if serializer:
                data = serializer.data
                data["type"] = post.post_type()
                data["author"] = UserSerializer(post.author, context={'request': request}).data 
                queryset_data.append(data)
        
        # Calculer le nombre de publications
        posts_count = len(all_posts)

        return Response({'posts_count': posts_count, 'posts': queryset_data})




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