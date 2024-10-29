from core.abstract.viewsets import AbstractViewSet
from core.center.models import(
    School,
    Study
)
from core.author.serializers import (
    UserSerializer, ServiceSerializer,
    PeerSerializer, PeerPositionSerializer,
    StudentSerializer, ProfessorSerializer,
    PersonnelSerializer 
)
from core.author.models import (
    User, Service, Peer,
    PeerPosition, Student,
    Professor, Personnel
    )
from core.auth.permissions import UserPermission
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
import logging

logger = logging.getLogger(__name__)

#user i follows
class UserViewSet(AbstractViewSet):
    http_method_names = ("post", "get", "patch", "put") 
    serializer_class = UserSerializer
    permission_classes = (UserPermission, IsAuthenticated)
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'first_name', 
        'last_name', 
        'username', 
        'email',
        'inp_mail'
        ] 

    def get_queryset(self):
        user_pk = self.kwargs.get("user__pk") # here, user_pk is user_public_id
        if user_pk:
            try:
                user = User.objects.get(public_id=user_pk)
                return user.follows.all()
            except User.DoesNotExist:
                return []
        return User.objects.all()

    def get_object(self):
        obj = User.objects.get_object_by_public_id(self.kwargs.get("pk"))
        self.check_object_permissions(self.request, obj)
        return obj
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
 
class StudentViewSet(AbstractViewSet):
    """
    ViewSet for handling Student-related operations.
    Supports CRUD operations on Student objects.
    """
    http_method_names = ("get", "post", "put", "patch", "delete")
    permission_classes = (IsAuthenticated, UserPermission)
    serializer_class = StudentSerializer

    def get_queryset(self):
        """
        Get the list of items for this view.
        If a user_pk is provided, return students for that user.
        Otherwise, return all students.
        """
        # user_pk = self.kwargs.get("user__pk")
        # if user_pk:
        #     user = get_object_or_404(User, public_id=user_pk)
        #     return Student.objects.filter(user=user)
        return Student.objects.all()
    
    def get_object(self):
        obj = Student.objects.get_object_by_public_id(self.kwargs.get("pk"))
        self.check_object_permissions(self.request, obj)
        return obj

    def create(self, request, *args, **kwargs):
        """
        Create a new Student object.
        """
        user_pk = self.kwargs.get("user__pk")
        user = get_object_or_404(User, public_id=user_pk)
        
        if hasattr(user, 'student'):
            return Response({"detail": "A student profile already exists for this user."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Update an existing Student object.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """
        Partially update a Student object.
        """
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete a Student object by resetting its fields.
        """
        instance = self.get_object()
        for field in instance._meta.fields:
            if field.name not in ['id', 'user']:
                setattr(instance, field.name, field.get_default())
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class ProfessorViewSet(AbstractViewSet):
    """
    ViewSet for handling Professor-related operations.
    Supports CRUD operations on Professor objects.
    """
    http_method_names = ("get", "post", "put", "patch", "delete")
    permission_classes = (IsAuthenticated, UserPermission)
    serializer_class = ProfessorSerializer

    def get_queryset(self):
        """
        Get the list of items for this view.
        """
        user_pk = self.kwargs.get("user__pk")
        if user_pk:
            user = get_object_or_404(User, public_id=user_pk)
            return Professor.objects.filter(user=user)
        return Professor.objects.all()

    def get_object(self):
        obj = Professor.objects.get_object_by_public_id(self.kwargs.get("pk"))
        self.check_object_permissions(self.request, obj)
        return obj

    def create(self, request, *args, **kwargs):
        """
        Create a new Professor object.
        """
        user_pk = self.kwargs.get("user__pk")
        user = get_object_or_404(User, public_id=user_pk)
        
        if hasattr(user, 'professor'):
            return Response({"detail": "A professor profile already exists for this user."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Update an existing Professor object.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)

        # Vérifiez si les champs 'study[]' et 'school[]' sont présents dans les données
        if 'study[]' in request.data:
            studies = request.data.getlist('study[]')  # Récupérer les valeurs sous forme de liste
            study_objects = Study.objects.filter(public_id__in=studies)  # Récupérer les objets Study
            instance.study.set(study_objects)  # Mettre à jour les relations ManyToMany

        if 'school[]' in request.data:
            schools = request.data.getlist('school[]')  # Récupérer les valeurs sous forme de liste
            school_objects = School.objects.filter(public_id__in=schools)  # Récupérer les objets School
            instance.school.set(school_objects)  # Mettre à jour les relations ManyToMany

        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """
        Soft delete a Professor object by resetting its fields.
        """
        instance = self.get_object()
        for field in instance._meta.fields:
            if field.name not in ['id', 'user']:
                setattr(instance, field.name, field.get_default())
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class PersonnelViewSet(AbstractViewSet):
    """
    ViewSet for handling Personnel-related operations.
    Supports CRUD operations on Personnel objects.
    """
    http_method_names = ("get", "post", "put", "patch", "delete")
    permission_classes = (IsAuthenticated, UserPermission)
    serializer_class = PersonnelSerializer

    def get_queryset(self):
        """
        Get the list of items for this view.
        """
        user_pk = self.kwargs.get("user__pk")
        if user_pk:
            user = get_object_or_404(User, public_id=user_pk)
            return Personnel.objects.filter(user=user)
        return Personnel.objects.all()

    def get_object(self):
        """
        Get the specific Personnel object for the given user.
        """
        obj = Personnel.objects.get_object_by_public_id(self.kwargs.get("pk"))
        self.check_object_permissions(self.request, obj)
        return obj


    def create(self, request, *args, **kwargs):
        """
        Create a new Personnel object.
        """
        user_pk = self.kwargs.get("user__pk")
        user = get_object_or_404(User, public_id=user_pk)

        if hasattr(user, 'personnel'):
            return Response({"detail": "A personnel profile already exists for this user."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Update an existing Personnel object.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """
        Partially update a Personnel object.
        """
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete a Personnel object by resetting its fields.
        """
        instance = self.get_object()
        for field in instance._meta.fields:
            if field.name not in ['id', 'user']:
                setattr(instance, field.name, field.get_default())
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class ServiceViewSet(AbstractViewSet):
    http_method_names = ("post", "get")
    permission_classes = (UserPermission,)
    serializer_class = ServiceSerializer
    filterset_fields = ["created"]
    search_fields = ['label',] 

    def get_queryset(self):
        """
        only service i managed or i
        follow base on user_pk else,
        return all.
        """
        user_pk = self.kwargs.get("user__pk")#here, user_pk is user_public_id
        school_pk = self.kwargs.get("school__pk")
        if user_pk:
            try:
                user = User.objects.get(public_id=user_pk)
                return Service.objects.filter(manager=user)
            except User.DoesNotExist:
                return []
        if school_pk:
               return Service.objects.filter(school__public_id=school_pk)
        return Service.objects.all()

    def get_object(self):
        obj = Service.objects.get_object_by_public_id(self.kwargs["pk"])

        self.check_object_permissions(self.request, obj)

        return obj
    
class PeerViewSet(AbstractViewSet):
    http_method_names = ("post", "get")
    permission_classes = (UserPermission,)
    serializer_class = PeerSerializer
    filterset_fields = ["created"]

    #only Peer i managed
    def get_queryset(self):
        return Peer.objects.all()

    def get_object(self):
        obj = Peer.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj
    
class PeerPositionViewSet(AbstractViewSet):
    http_method_names = ("post", "get")
    permission_classes = (UserPermission,)
    serializer_class = PeerPositionSerializer
    filterset_fields = ["-created"]
    filter_backends = [filters.SearchFilter]
    search_fields = ['position', 'student__first_name', 'student__last_name']  

    def get_queryset(self):
        peer_pk = self.kwargs.get("peer__pk")
        if peer_pk:
            return PeerPosition.objects.filter(peer__public_id=peer_pk)

    def get_object(self):
        obj = PeerPosition.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj
    


