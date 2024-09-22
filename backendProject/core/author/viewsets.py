from core.abstract.viewsets import AbstractViewSet
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


#user i follows
class UserViewSet(AbstractViewSet):
    http_method_names = ("post", "get", "patch") 
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
        # self.check_object_permissions(self.request, obj)
        return obj
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
 
class StudentViewSet(AbstractViewSet):
    http_method_names = ("post", "get")
    permission_classes = (UserPermission,)
    serializer_class = StudentSerializer
    filterset_fields = ["-created"]

    def get_queryset(self):
        study_pk = self.kwargs.get("study_pk")
        peer_pk = self.kwargs.get("peer_pk")
        school_pk = self.kwargs.get("school_pk")

        if study_pk :
            print("####################study/student")
            return Student.objects.filter(study__public_id=study_pk)
        if peer_pk:
            print("####################peer/student")
            return Student.objects.filter(peer__public_id=peer_pk)
        if school_pk:
            print("####################school/student")
            return Student.objects.filter(school__public_id=school_pk)

        return Student.objects.all()
        
    
    def get_object(self):
        obj = Student.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj


class ProfessorViewSet(AbstractViewSet):
    http_method_names = ("post", "get")
    permission_classes = (UserPermission,)
    serializer_class = ProfessorSerializer
    filterset_fields = ["-created"]

    def get_queryset(self):
        study_pk = self.kwargs.get("study_pk")
        school_pk = self.kwargs.get("school_pk")

        if study_pk :
            print("#################study/professor")
            return Professor.objects.filter(study__public_id=study_pk)
        if school_pk :
            print("#################school/professor")
            return Professor.objects.filter(school__public_id=school_pk)
    
        return Professor.objects.all()
        
    def get_object(self):
        obj = Student.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj
    

class PersonnelViewSet(AbstractViewSet):
    http_method_names = ("post", "get")
    permission_classes = (UserPermission,)
    serializer_class = PersonnelSerializer
    filterset_fields = ["-created"]

    def get_queryset(self):
        study_pk = self.kwargs.get("study_pk")#api/study/public_id/personnel
        school_pk = self.kwargs.get("school_pk")#api/school/public_id/personnel
        if study_pk :
            return Personnel.objects.filter(study__public_id=study_pk)
        if school_pk :
            return Personnel.objects.filter(school__public_id=school_pk)
        return Personnel.objects.all()
        
    def get_object(self):
        obj = Student.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj


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
        peer_pk = self.kwargs.get("peer_pk")
        if peer_pk:
            return PeerPosition.objects.filter(peer__public_id=peer_pk)

    def get_object(self):
        obj = PeerPosition.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj
    
