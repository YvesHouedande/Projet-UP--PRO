from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from core.author.models import User
from core.auth.permissions import UserPermission
from core.abstract.viewsets import AbstractViewSet
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from core.content.serializers import (
    PostUserSerializer, PostPeerSerializer,
     PostServiceSerializer, EventSerializer,
    CommentSerializer
    )

from core.content.models import (
    PostPeer, PostUser, 
    PostService, Comment, Event
    )

from core.author.serializers import UserSerializer
from rest_framework import status
from .models import  PostService, PostPeer, PostUser
from .serializers import PostServiceSerializer, PostPeerSerializer, PostUserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from django.db.models import Q

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
    permission_classes = [IsAuthenticated, UserPermission]

    def list(self, request):
        search_param = request.query_params.get('search')
        filter_value = request.query_params.get('filter')
        
        # Si un paramètre de recherche est fourni, filtrez les résultats en fonction de ce paramètre
        if search_param:
            queryset_service = PostService.objects.filter(
                Q(title__icontains=search_param) | 
                Q(service__label__icontains=search_param) |
                Q(service__manager__first_name__icontains=search_param) |
                Q(service__manager__last_name__icontains=search_param)
            ).distinct()
            
            queryset_user = PostUser.objects.filter(
                Q(title__icontains=search_param) |
                Q(author__first_name__icontains=search_param) |
                Q(author__last_name__icontains=search_param)
            ).distinct()

            queryset_peer = PostPeer.objects.filter(
                Q(title__icontains=search_param) |
                Q(peer__label__icontains=search_param) |
                Q(peer__study__label__icontains=search_param) |
                Q(peer__manager__first_name__icontains=search_param) |
                Q(peer__manager__last_name__icontains=search_param)
            ).distinct()

            all_querysets = list(queryset_user) + list(queryset_service) + list(queryset_peer)
            all_posts = sorted(all_querysets, key=lambda x: x.created, reverse=True)
            return self.serialize_posts(all_posts, request)

        if filter_value == "administration":
            return self.get_administration_posts(request)
        elif filter_value == "popular":
            return self.get_popular_posts(request)
        else:
            return self.get_all_posts(request)

    def get_administration_posts(self, request):
        """Return all important services i follow """
        queryset_service, final_data = PostService.objects.filter(service__follows=request.user), []
        ad_posts = [x for x in queryset_service if x.post_type()=="Adminitration"]
        posts_count = len(ad_posts)
        
        for post in ad_posts:
            post_data = PostServiceSerializer(post, context={'request': request}).data
            post_data["author"] = UserSerializer(request.user, context={'request': request}).data
            post_data["type"] = post.post_type()
            final_data.append(post_data)
        return Response({"posts_count": posts_count, "posts": final_data}) 

    def get_popular_posts(self, request):
        """Return all popular services i follows """
        queryset_service = PostService.objects.filter(service__follows=request.user)
        queryset_user = PostUser.objects.filter(author__follows=request.user)
        queryset_peer = PostPeer.objects.filter(peer__follows=request.user)

        all_querysets = list(queryset_user) + list(queryset_service) + list(queryset_peer)
        all_posts = [x for x in all_querysets if x.is_popular()]
        return self.serialize_posts(all_posts, request)


    def get_all_posts(self, request):
        queryset_service = PostService.objects.filter(service__follows=request.user)
        queryset_user = PostUser.objects.filter(author__follows=request.user)
        queryset_peer = PostPeer.objects.filter(peer__follows=request.user)
        all_querysets = list(queryset_user) + list(queryset_service) + list(queryset_peer)
        all_posts = sorted(all_querysets, key=lambda x: x.created, reverse=True)
        return self.serialize_posts(all_posts, request)

    def serialize_posts(self, posts, request):
        queryset_data = []
        for post in posts:
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
                data["like_links"] = post.post_like_actions()
                queryset_data.append(data)
        
        posts_count = len(posts)
        return Response({'posts_count': posts_count, 'posts': queryset_data})
    

    
###################### PostUserViewSet 
class PostUserViewSet(AbstractViewSet):
    http_method_names = ("post", "get",  "delete")
    permission_classes = ( IsAuthenticated, UserPermission)
    serializer_class = PostUserSerializer
    filterset_fields = [ "updated"]

    def get_queryset(self):
        user_pk = self.kwargs.get("user__pk")  # Correction de la clé ici
        if user_pk:
            try:
                user = User.objects.get(public_id=user_pk)
            except User.DoesNotExist:
                return PostUser.objects.none()
            return PostUser.objects.filter(author=user)
        return PostUser.objects.all()

    def get_object(self):
        obj = PostUser.objects.get_object_by_public_id(self.kwargs["pk"])
        # self.check_object_permissions(self.request, obj)
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
    

class PostPeerViewSet(AbstractViewSet):
    http_method_names = ("post", "get",  "delete", "put")
    permission_classes = (UserPermission, IsAuthenticated)
    serializer_class = PostPeerSerializer
    filterset_fields = ["updated"]

    def get_queryset(self):
        return PostPeer.objects.all()

    def get_object(self):
        obj = PostPeer.objects.get_object_by_public_id(self.kwargs["pk"])
        print(f"Getting object: {obj}")

        self.check_object_permissions(self.request, obj)
        print("Object permissions checked")

        return obj
    
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


###################### PostServiceViewSet
class PostServiceViewSet(AbstractViewSet):
    http_method_names = ("get",  "delete")
    permission_classes = (UserPermission,)
    serializer_class = PostServiceSerializer
    filterset_fields = ["updated"]

    def get_queryset(self):
        return PostService.objects.all()

    def get_object(self):
        obj = PostService.objects.get_object_by_public_id(self.kwargs["pk"])

        self.check_object_permissions(self.request, obj)

        return obj

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
    filterset_fields = ["updated"]

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
    

class EventViewSet(AbstractViewSet):
    http_method_names = ("post", "get",  "delete")
    permission_classes = (UserPermission,)
    serializer_class = EventSerializer
    filterset_fields = ["-created"]
    filter_backends = [filters.SearchFilter]
    search_fields = ['label', "description"] 

    def get_queryset(self):
        service_pk = self.kwargs.get("service_pk")
        if service_pk :
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
