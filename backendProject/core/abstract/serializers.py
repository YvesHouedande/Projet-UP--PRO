from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.author.models import User



class AbstractSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source="public_id", read_only=True, format="hex")
    created = serializers.DateTimeField(read_only=True)
    updated = serializers.DateTimeField(read_only=True)



class AbstractPostSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(
    queryset=User.objects.all(), slug_field="public_id"
    )
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    def get_comments_count(self, instance):
        return instance.comment_set.count()

    def get_likes_count(self, instance):
        return instance.likes.count()

    def validate_author(self, value):
        if self.context["request"].user != value:
            raise ValidationError("You can't create a post for another user.")
        return value

    def validate_content(self, value):
        if not value:
            raise serializers.ValidationError("Le champ 'content' est requis.")
        return value
    
    def update(self, instance, validated_data):
        if not instance.edited:
            validated_data["edited"] = True
        instance = super().update(instance, validated_data)
        return instance

