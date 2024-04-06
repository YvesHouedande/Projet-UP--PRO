from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import PostPeer

from core.abstract.serializers import AbstractSerializer, AbstractPostSerializer
from core.author.models import User
from core.author.serializers import UserSerializer
from core.content.models import (
    PostUser, PostPeer, PostService,
    GeneralPost, Comment, Event
)



class PostUserSerializer(AbstractSerializer, AbstractPostSerializer):
    class Meta:
        model = PostUser
        # List of all the fields that can be included in a request or a response
        fields = [
            "title",
            "public_id",
            "author",
            "content_type",
            "content",
            "file",
            "edited",
            "likes_count",
            "comments_count",
            "created",
            "updated",
        ]
        read_only_fields = ["edited"]


class PostPeerSerializer(AbstractSerializer, AbstractPostSerializer):
    class Meta:
        model = PostPeer
        fields = [
            "title",
            "public_id",
            "author",
            "content_type",
            "content",
            "file",
            "edited",
            "likes_count",
            "comments_count",
            "created",
            "updated",
            ]
    read_only_fields = ["edited"]

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
    #create event for service that i only managed
    def validate_service(self, value):
        if self.context["request"].user != value.manager:
            raise ValidationError("Tu ne peux pas creer un event pour un service dont tu n'est pas resposable")
        return value
    
    class Meta:
        model = Event
        fields = "__all__" 
