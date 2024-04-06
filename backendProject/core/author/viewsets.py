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
from rest_framework.response import Response
from core.auth.permissions import UserPermission


#user i follows
class UserViewSet(AbstractViewSet):
    http_method_names = ("post", "get")
    serializer_class = UserSerializer
    permission_classes = (UserPermission,)

    def get_queryset(self):
        user = self.request.user
        return User.objects.all()
        return  user.follows.all()

    def get_object(self):
        obj = User.objects.get_object_by_public_id(self.kwargs.get("pk"))
        self.check_object_permissions(self.request, obj)
        return obj
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
 
#router.register(r"study/students", StudentViewSet, basename="study-students")################ 
# class StudentViewSet(AbstractViewSet):
#     http_method_names = ("post", "get")
#     permission_classes = (UserPermission,)
#     serializer_class = StudentSerializer
#     filterset_fields = ["-created"]

#     def get_queryset(self):
#         if self.basename == "student":
#             # Retourner tous les étudiants
#             return Student.objects.all()
#         elif self.basename == "study-students":
#             # Retourner les étudiants associés à une étude spécifique
#             study_id = self.request.query_params.get("study_id")
#             if study_id:
#                 return Student.objects.filter(study_id=study_id)
#             else:
#                 return Student.objects.none()  # Aucun ID d'étude fourni, aucun étudiant retourné
#         else:
#             # Si le basename ne correspond à aucun des noms de route définis dans les routes, 
#             # vous pouvez choisir de retourner une queryset vide ou une erreur, selon vos besoins.
#             return Student.objects.none()
    
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

    #only service i managed
    def get_queryset(self):
        user_pk = self.kwargs.get("user_pk")#here, user_pk is user_public_id
        school_pk = self.kwargs.get("school_pk")
        if user_pk:
            try:
                user = User.objects.get(public_id=user_pk)
                from django.db.models import Q
                return Service.objects.filter(Q(follows=user) | Q(manager=user))
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

    def get_queryset(self):
        peer_pk = self.kwargs.get("peer_pk")
        if peer_pk:
            return PeerPosition.objects.filter(peer__public_id=peer_pk)

    def get_object(self):
        obj = PeerPosition.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj
    
