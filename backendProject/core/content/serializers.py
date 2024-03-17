from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.abstract.serializers import AbstractSerializer, AbstractPostSerializer
from core.author.models import User
from core.author.serializers import UserSerializer
from core.content.models import (
    PostUser, PostPeer, PostService,
    GeneralPost, Comment, Event
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
