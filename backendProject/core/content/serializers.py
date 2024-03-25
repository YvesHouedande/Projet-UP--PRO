from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .models import PostPeer

from core.abstract.serializers import AbstractSerializer, AbstractPostSerializer
from core.author.models import User
from core.author.serializers import UserSerializer
from core.content.models import (
    PostUser, PostPeer, PostService,
    GeneralPost, Comment, Event
)


# class GeneralPostSerializer(AbstractSerializer, AbstractPostSerializer):
#     class Meta:
#         model = GeneralPost
#         fields = "__all__"

    # def to_representaion(self, instance):
    #     rep = super.to_represenation(self, instance)

    #     post_peer = get_object_or_404(PostPeer, public_id=instance.public_id)
    #     post_user = get_object_or_404(PostUser, public_id=instance.public_id)
    #     post_service = get_object_or_404(PostService, public_id=instance.public_id)

    #     if post_peer:
    #         rep["post_peer"] = PostPeerSerializer(post_peer, context=self.context).data
    #     elif post_user:
    #         rep["post_user"] = PostPeerSerializer(post_user, context=self.context).data
    #     elif post_service:
    #         rep["post_service"] = PostPeerSerializer(post_user, context=self.context).data


# class GeneralPostSerializer(serializers.Serializer):
#     # content_type = serializers.CharField()
#     # post_peer_data = serializers.SerializerMethodField()
#     post_service_data = serializers.SerializerMethodField()
#     # post_user_data = serializers.SerializerMethodField() 

    

#     def get_post_service_data(self, obj):
#         serializer = PostServiceSerializer(obj)

#         return serializer.data
    
#     # def get_post_peer_data(self, obj):
#     #     serializer = PostPeerSerializer(obj)
#     #     return serializer.data

#     # def get_post_user_data(self, obj):
#     #     serializer = PostUserSerializer(obj)

#         # return serializer.data

class PostUserSerializer(AbstractSerializer, AbstractPostSerializer):
    class Meta:
        model = PostUser
        # List of all the fields that can be included in a request or a response
        fields = [
            "title",
            "public_id",
            "author",
            "content_type",
            "description",
            "file",
            "edited",
            "likes_count",
            "comments_count",
            "created",
            "updated",
        ]
        read_only_fields = ["edited"]


class PostPeerSerializer(AbstractSerializer, AbstractPostSerializer):
    # author = serializers.CharField()
    class Meta:
        model = PostPeer
        fields = "__all__"

class PostServiceSerializer(AbstractSerializer, AbstractPostSerializer):
    author = serializers.SlugRelatedField(
    queryset=User.objects.all(), slug_field="public_id"
    )
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    def get_comments_count(self, instance):
        return instance.comment_set.count()

    def get_likes_count(self, instance):
        return instance.likes.count()
    class Meta:
        model = PostService
        fields = "__all__"


class CommentSerializer(AbstractSerializer):
    author = serializers.SlugRelatedField(
    queryset=User.objects.all(), slug_field="public_id"
    )
    post = serializers.SlugRelatedField(
    queryset=GeneralPost.objects.all(), slug_field="public_id"
    )

    def validate_author(self, value):
        if self.context["request"].user != value:
            raise ValidationError("You can't create a post for another user.")
        return value
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        author = User.objects.get_object_by_public_id(rep["author"])
        rep["author"] = UserSerializer(author, context=self.context).data
        return rep
    
    class Meta:
        model = Comment
        fields = "__all__" 


class EventSerializer(AbstractSerializer):
    author = serializers.SlugRelatedField(
    queryset=Event.objects.all(), slug_field="public_id"
    )


    def validate_author(self, value):
        if self.context["request"].user != value:
            raise ValidationError("You can't create a post for another user.")
        return value
    
    class Meta:
        model = Event
        fields = "__all__" 
