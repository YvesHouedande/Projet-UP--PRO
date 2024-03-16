from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.abstract.serializers import AbstractSerializer, AbstractPostSerializer
from core.author.models import User
from core.author.serializers import UserSerializer
from core.content.models import (
    PostUser, PostPeer, PostService,
    GeneralPost, Comment
)


class GeneralPostSerializer(AbstractSerializer, AbstractPostSerializer):
    class Meta:
        model = GeneralPost
        fields = "__all__"


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
    class Meta:
        model = PostPeer
        fields = "__all__"

class PostServiceSerializer(AbstractSerializer, AbstractPostSerializer):
    class Meta:
        model = PostService
        fields = "__all__"



class CommentSerializer(AbstractSerializer, AbstractPostSerializer):
    class Meta:
        model = Comment
        fields = "__all__" 