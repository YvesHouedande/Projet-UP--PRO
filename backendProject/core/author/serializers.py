from rest_framework import serializers
from django.conf import settings
from rest_framework.exceptions import ValidationError

from core.abstract.serializers import AbstractSerializer
from core.author.models import(
     User, Service, Peer,
     PeerPosition, Student,
     Professor, Personnel
     )
from core.center.models import School, Study
class UserSerializer(AbstractSerializer):
    posts_count = serializers.SerializerMethodField()
 
    def get_posts_count(self, instance):
        return instance.posts.all().count()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not representation["avatar"]:
            representation["avatar"] = settings.DEFAULT_AVATAR_URL
            return representation
        if settings.DEBUG:  # debug enabled for dev
            request = self.context.get("request")
            representation["avatar"] = request.build_absolute_uri(
                representation["avatar"]
            )
        return representation
 
    class Meta:
        model = User
        # List of all the fields that can be included in a request or a response
        fields = [
            "id",
            "username",
            "name",
            "first_name",
            "last_name",
            "bio",
            "avatar",
            "email",
            "is_active",
            "created",
            "updated",
            "posts_count",
        ]
        # List of all the fields that can only be read by the user
        read_only_field = ["is_active"]


class StudentSerializer(AbstractSerializer):
    posts_count = serializers.SerializerMethodField()

    def get_posts_count(self, instance):
        return instance.posts.all().count()
    class Meta:
        model = Student
        fields = [
            "id",
            "username",
            "name",
            "first_name",
            "last_name",
            "bio",
            "avatar",
            "email",
            "study",
            "school",
            "created",
            "updated", 
            "posts_count",
        ]  


class ProfessorSerializer(AbstractSerializer):
    posts_count = serializers.SerializerMethodField()

    def get_posts_count(self, instance):
        return instance.posts.all().count()
    class Meta:
        model = Professor
        fields = [
            "id",
            "username",
            "name",
            "first_name",
            "last_name",
            "study",
            "school",
            "bio",
            "avatar",
            "email",
            "created",
            "updated", 
            "posts_count",
        ]


class PersonnelSerializer(AbstractSerializer):
    posts_count = serializers.SerializerMethodField()

    def get_posts_count(self, instance):
        return instance.posts.all().count()
    class Meta:
        model = Personnel
        fields = [
            "id",
            "username",
            "name",
            "first_name",
            "last_name",
            "study",
            "school",
            "bio",
            "avatar",
            "email",
            "created",
            "updated", 
            "posts_count",
        ]


class ServiceSerializer(AbstractSerializer):
    school = serializers.SlugRelatedField(
    queryset=School.objects.all(), slug_field="public_id"
    )
    event_count = serializers.SerializerMethodField()

    def get_event_count(self, instance):
        return instance.events.all().count()
    class Meta:
        model = Service
        fields = "__all__" 


class PeerSerializer(AbstractSerializer):
    school = serializers.SlugRelatedField(
        queryset=School.objects.all(), slug_field="public_id",
    )
    study = serializers.SlugRelatedField(
        queryset=Study.objects.all(), slug_field="public_id",
    )
    class Meta: 
        model = Peer
        fields = "__all__" 

class PeerPositionSerializer(AbstractSerializer):
    peer = serializers.SlugRelatedField(
    queryset=Peer.objects.all(), slug_field="public_id"
    )
    # student = serializers.SlugRelatedField(
    # queryset=Student.objects.all(), slug_field="public_id" 
    # )
    
    def validate(self, data): 
        #student should update it's data to the peer it own
        if data["student"].peer != data["peer"]: 
            raise ValidationError("You can't create a position for student not in your peer")
        return data
    class Meta:
        model = PeerPosition
        fields = "__all__"  