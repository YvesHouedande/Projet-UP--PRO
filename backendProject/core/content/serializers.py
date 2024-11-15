from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from core.abstract.serializers import AbstractSerializer, AbstractPostSerializer
from core.author.models import Service, User, Peer
from core.author.serializers import ServiceSerializer, UserSerializer
from core.content.models import (
    GeneralPost, Comment, Event
)

class GeneralPostSerializer(AbstractSerializer, AbstractPostSerializer):
    author = serializers.SlugRelatedField(
        queryset=User.objects.all(), 
        slug_field="public_id"
    )

    class Meta:
        model = GeneralPost
        fields = [
            "title", "public_id", "author", "content_type",
            "content", "image", "edited", "likes_count",
            "comments_count", "created", "updated", "source"
        ]
        read_only_fields = ["edited"]

    def validate(self, attrs):
        request = self.context.get('request')
        source = attrs.get('source')
        
        if source == 'promotion':
            peer_id = self.context.get('peer_id')
            if not peer_id:
                raise ValidationError("ID de promotion manquant")
            try:
                peer = Peer.objects.get(public_id=peer_id)
                if peer.manager.user != request.user:
                    raise ValidationError("Seul le délégué peut publier au nom de la promotion")
            except Peer.DoesNotExist:
                raise ValidationError("Promotion non trouvée")
        
        elif source == 'service':
            service_id = self.context.get('service_id')
            if not service_id:
                raise ValidationError("ID de service manquant")
            try:
                service = Service.objects.get(public_id=service_id)
                if service.manager != request.user:
                    raise ValidationError("Seul le responsable peut publier au nom du service")
            except Service.DoesNotExist:
                raise ValidationError("Service non trouvé")
        
        return super().validate(attrs)

    def create(self, validated_data):
        post = super().create(validated_data)
        
        # Ajouter le post à la promotion ou au service selon le contexte
        if validated_data.get('source') == 'promotion':
            peer_id = self.context.get('peer_id')
            if peer_id:
                peer = Peer.objects.get(public_id=peer_id)
                peer.posts.add(post)
        
        elif validated_data.get('source') == 'service':
            service_id = self.context.get('service_id')
            if service_id:
                service = Service.objects.get(public_id=service_id)
                service.posts.add(post)
        
        return post

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        author = User.objects.get_object_by_public_id(rep["author"])
        rep["author"] = UserSerializer(author, context=self.context).data
        
        # Ajouter les infos de la promotion/service si nécessaire
        if instance.source == 'promotion':
            peer = instance.peer_posts.first()
            if peer:
                rep["peer"] = {
                    "id": peer.public_id,
                    "label": peer.label
                }
        
        elif instance.source == 'service':
            service = instance.service_posts.first()
            if service:
                rep["service"] = {
                    "id": service.public_id,
                    "label": service.label
                }
        
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
        queryset=Service.objects.all(), 
        slug_field="public_id",
        required=False,
        allow_null=True
    )
    peer = serializers.SlugRelatedField(
        queryset=Peer.objects.all(), 
        slug_field="public_id",
        required=False,
        allow_null=True
    )

    class Meta:
        model = Event
        fields = [
            "label",
            "description",
            "moment",
            "service",
            "peer",
            "cover",
            "place", 
            "public_id"
        ]
        
    def validate(self, data):
        request = self.context["request"]
        service = data.get('service')
        peer = data.get('peer')

        if not service and not peer:
            raise ValidationError("Un événement doit être associé à un service ou une promotion")
        
        if service and peer:
            raise ValidationError("Un événement ne peut pas être associé à la fois à un service et une promotion")

        if service and request.user != service.manager:
            raise ValidationError("Vous n'êtes pas responsable de ce service")
            
        if peer and (not hasattr(request.user, 'student') or request.user.student != peer.manager):
            raise ValidationError("Vous n'êtes pas délégué de cette promotion")

        return data
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        
        if instance.service:
            rep["source"] = "service"
            rep["source_label"] = instance.service.label
        elif instance.peer:
            rep["source"] = "promotion"
            rep["source_label"] = instance.peer.label

        return rep
  
     