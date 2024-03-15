from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.abstract.serializers import AbstractSerializer
from core.content.models import PostUser
from core.author.models import User
from core.author.serializers import UserSerializer


class PostUserSerializer(AbstractSerializer):
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

    def update(self, instance, validated_data):
        if not instance.edited:
            validated_data["edited"] = True

        instance = super().update(instance, validated_data)

        return instance

    # def to_representation(self, instance):
    #     rep = super().to_representation(instance)
    #     author = User.objects.get_object_by_public_id(rep["author"])
    #     rep["author"] = UserSerializer(author, context=self.context).data

    #     return rep

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
