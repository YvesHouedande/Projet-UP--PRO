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
        return instance.posts.count()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not representation["avatar"]:
            representation["avatar"] = settings.DEFAULT_AVATAR_URL
        elif settings.DEBUG:
            request = self.context.get("request")
            representation["avatar"] = request.build_absolute_uri(representation["avatar"])
        return representation
 
    class Meta:
        model = User
        fields = [
            "public_id", "name", "first_name", "last_name", "bio", "avatar",
            "email", "created", "updated", "posts_count", "is_superuser",
            "status_choice", "from_inp", 'inp_mail',
        ]
        read_only_fields = ["is_active", "is_superuser"]


class StudentSerializer(AbstractSerializer):
    posts_count = serializers.SerializerMethodField()
    study = serializers.SlugRelatedField(queryset=Study.objects.all(), slug_field="public_id")
    school = serializers.SlugRelatedField(queryset=School.objects.all(), slug_field="public_id")

    def get_posts_count(self, instance):
        return instance.posts.count()

    class Meta:
        model = Student
        fields = [
            "bac_year", "study", "school", "level_choices","public_id","id",
            "created", "updated", "posts_count",'user'
        ]  


class ProfessorSerializer(AbstractSerializer):
    posts_count = serializers.SerializerMethodField()
    study = serializers.SlugRelatedField(queryset=Study.objects.all(), slug_field="public_id", many=True)
    school = serializers.SlugRelatedField(queryset=School.objects.all(), slug_field="public_id", many=True)

    def get_posts_count(self, instance):
        return instance.posts.count()

    class Meta:
        model = Professor
        fields = [
            "subject", "study", "school",
            "created", "updated", "posts_count",
        ]


class PersonnelSerializer(AbstractSerializer):
    posts_count = serializers.SerializerMethodField()
    study = serializers.SlugRelatedField(queryset=Study.objects.all(), slug_field="public_id", many=True)
    school = serializers.SlugRelatedField(queryset=School.objects.all(), slug_field="public_id")

    def get_posts_count(self, instance):
        return instance.posts.count()

    class Meta:
        model = Personnel
        fields = [
            "study", "job", "administration", "school",
            "created", "updated", "posts_count",
        ] 


class ServiceSerializer(AbstractSerializer):
    school = serializers.SlugRelatedField(
    queryset=School.objects.all(), slug_field="public_id"
    )
    event_count = serializers.SerializerMethodField()

    def get_event_count(self, instance):
        return instance.events.count()
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
    pass
    # peer = serializers.SlugRelatedField(
    # queryset=Peer.objects.all(), slug_field="public_id"
    # )
    # student = serializers.SlugRelatedField(
    #     queryset=Student.objects.all(), slug_field="public_id", read_only=True
    # )
    
    # def validate(self, data):
    #     student = self.context['request'].user.student
    #     if student.peer != data["peer"]:
    #         raise ValidationError("Vous ne pouvez pas créer une position pour un étudiant qui n'est pas dans votre promotion")
    #     data['student'] = student
    #     return data
    # class Meta:
    #     model = PeerPosition
    #     fields = "__all__"
