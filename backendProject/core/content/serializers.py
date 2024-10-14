from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from core.abstract.serializers import AbstractSerializer, AbstractPostSerializer
from core.author.models import Service, User
from core.author.serializers import ServiceSerializer, UserSerializer
from core.content.models import (
    GeneralPost, Comment, Event
)

class GeneralPostSerializer(AbstractSerializer, AbstractPostSerializer):
    author = serializers.SlugRelatedField(
    queryset=User.objects.all(), slug_field="public_id"
    )
    class Meta:
        model = GeneralPost
        # List of all the fields that can be included in a request or a response
        fields = [
            "title",
            "public_id",
            "author",
            "content_type",
            "content",
            "image",
            "edited",
            "likes_count",
            "comments_count",
            "created",
            "updated",
            'source',
        ]
        read_only_fields = ["edited"]

    def to_representation(self, instance): 
        rep = super().to_representation(instance)
        author = User.objects.get_object_by_public_id(rep["author"])
        rep["author"] = UserSerializer(author, context=self.context).data
        return rep

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
    service = serializers.SlugRelatedField(
    queryset=Service.objects.all(), slug_field="public_id"
    )
    class Meta:
        model = Event
        fields = [
            "label",
            "description",
            "moment",
            'service',
            "cover",
            "place", 
            "public_id"
            ]
        
    def validate_service(self, value):
        if self.context["request"].user != value.manager:
            raise ValidationError("Tu ne peux pas creer un event pour un service dont tu n'est pas resposable")
        return value
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        service_label = Service.objects.get_object_by_public_id(rep["service"]).label
        # rep["service"] = ServiceSerializer(service, context=self.context).data
        rep["service_label"] =  service_label

        return rep
  
     