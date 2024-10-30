from rest_framework import serializers
from django.conf import settings
from rest_framework.exceptions import NotFound

from core.abstract.serializers import AbstractSerializer
from core.author.models import(
     User, Service, Peer,
     PeerPosition, Student,
     Professor, Personnel
     )
from core.center.models import School, Study


class UserSerializer(AbstractSerializer):
    # posts_count = serializers.SerializerMethodField()
    
    # def get_posts_count(self, instance):
    #     return instance.posts.count()

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
            'public_id', 'first_name', 'last_name', 
            'email', 'avatar', 'status_choice', 'number',
            # 'posts_count',
        ]


class StudentBaseSerializer(AbstractSerializer):
    """Sérialiseur de base avec les champs communs"""
    user = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field="public_id")
    study = serializers.SlugRelatedField(queryset=Study.objects.all(), slug_field="public_id", required=False, allow_null=True)
    school = serializers.SlugRelatedField(queryset=School.objects.all(), slug_field="public_id", required=True)

    class Meta:
        model = Student
        fields = [
            "public_id", "user", "study", "school",
            "bac_year", "level_choices"
        ]

class StudentUpdateSerializer(StudentBaseSerializer):
    """Serializer pour la création et mise à jour"""
    level_choices_display = serializers.SerializerMethodField()

    class Meta(StudentBaseSerializer.Meta):
        fields = StudentBaseSerializer.Meta.fields + [
            "level_choices_display", "created", "updated"
        ]

    def get_level_choices_display(self, obj):
        return obj.get_level_choices_display() if obj.level_choices else None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['study'] = {
            "id": instance.study.public_id,
            "name": instance.study.label
        } if instance.study else None
        representation['school'] = {
            "id": instance.school.public_id,
            "name": instance.school.label
        }
        return representation

class StudentDetailSerializer(StudentBaseSerializer):
    """Serializer pour l'affichage détaillé avec infos utilisateur"""
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    avatar = serializers.SerializerMethodField()
    number = serializers.CharField(source='user.number', read_only=True)
    level_choices_display = serializers.SerializerMethodField()

    class Meta(StudentBaseSerializer.Meta):
        fields = StudentBaseSerializer.Meta.fields + [
            'first_name', 'last_name', 'email', 
            'avatar', 'number', 'level_choices_display'
        ]

    def get_avatar(self, obj):
        request = self.context.get('request')
        if obj.user.avatar:
            if request and settings.DEBUG:  # En développement
                return request.build_absolute_uri(obj.user.avatar.url)
            return obj.user.avatar.url
        return settings.DEFAULT_AVATAR_URL

    def get_level_choices_display(self, obj):
        return obj.get_level_choices_display() if obj.level_choices else None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['study'] = {
            "id": instance.study.public_id,
            "name": instance.study.label
        } if instance.study else None
        representation['school'] = {
            "id": instance.school.public_id,
            "name": instance.school.label
        }
        return representation


class ProfessorSerializer(AbstractSerializer):
    """
    Serializer for the Professor model.
    Handles the serialization and deserialization of Professor objects.
    """
    user = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field="public_id")
    study = serializers.SerializerMethodField()
    school = serializers.SerializerMethodField()

    class Meta:
        model = Professor
        fields = [
            "user", "subject", "study", "school",
            "created", "updated", "public_id", "id"
        ]

    def get_study(self, obj):
        """
        Get the list of studies associated with the professor.
        """
        return [{"id": study.id, "name": study.label} for study in obj.study.all()] if obj.study.exists() else []

    def get_school(self, obj):
        """
        Get the list of schools associated with the professor.
        """
        return [{"id": school.id, "name": school.label} for school in obj.school.all()] if obj.school.exists() else []


class PersonnelSerializer(AbstractSerializer):
    """
    Serializer for the Personnel model.
    Handles the serialization and deserialization of Personnel objects.
    """
    user = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field="public_id")
    study = serializers.SlugRelatedField(queryset=Study.objects.all(), slug_field="public_id", required=False, allow_null=True)
    school = serializers.SlugRelatedField(queryset=School.objects.all(), slug_field="public_id", required=True)

    class Meta:
        model = Personnel
        fields = [
            "user", "study", "job", "school","administration",
            "created", "updated", "public_id", "id"
        ]

    def to_representation(self, instance):
        """
        Override the to_representation method to customize the output format.
        """
        representation = super().to_representation(instance)
        
        # Format the study field
        representation['study'] = {
            "id": instance.study.public_id,
            "name": instance.study.label
        } if instance.study else None
        
        # Format the school field
        representation['school'] = {
            "id": instance.school.public_id,
            "name": instance.school.label
        } if instance.school else None
        
        return representation


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
    """Sérialiseur pour l'affichage détaillé d'une promotion"""
    study_label = serializers.CharField(source='study.label', read_only=True)
    school_label = serializers.CharField(source='school.label', read_only=True)
    manager = StudentDetailSerializer(read_only=True)

    class Meta:
        model = Peer
        fields = [
            'public_id', 'label', 'study_label', 'school_label',
            'year', 'cover', 'description', 'manager',
        ]


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


class PeerSearchSerializer(AbstractSerializer):
    study_label = serializers.SerializerMethodField()
    school_label = serializers.SerializerMethodField()

    def get_study_label(self, obj):
        return obj.study.label if obj.study else None

    def get_school_label(self, obj):
        return obj.school.label if obj.school else None

    class Meta:
        model = Peer
        fields = ['public_id', 'label', 'study_label', 'school_label', 'year', 'cover']

