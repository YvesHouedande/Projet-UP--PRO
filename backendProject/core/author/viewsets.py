from core.abstract.viewsets import AbstractViewSet
from core.center.models import(
    School,
    Study
)
from core.author.serializers import (
    UserSerializer, ServiceSerializer,
    PeerSerializer, PeerPositionSerializer,
    StudentUpdateSerializer, 
    StudentDetailSerializer, ProfessorSerializer, 
    PersonnelSerializer, PeerSearchSerializer,
    PeerDelegationSerializer
)
from core.author.models import (
    User, Service, Peer, Student,
    Professor, Personnel
    )

from core.content.models import GeneralPost
from core.auth.permissions import UserPermission
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated 
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
import logging
from rest_framework.exceptions import NotFound
from django.db.models import Q
from core.content.serializers import GeneralPostSerializer
from django_filters import rest_framework as django_filters
from django.db.models import Count

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

    def update(self, request, *args, **kwargs):
        """
        Mise à jour d'un utilisateur avec gestion du changement de statut
        """
        instance = self.get_object()
        old_status = instance.status_choice
        
        # Mise à jour normale de l'utilisateur
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        # Si le statut change, supprimer l'ancien profil
        new_status = serializer.validated_data.get('status_choice', old_status)
        if new_status != old_status:
            self._delete_old_profile(instance, old_status)
            
        self.perform_update(serializer)
        return Response(serializer.data)

    def _delete_old_profile(self, user, old_status):
        """
        Supprime l'ancien profil de l'utilisateur selon son statut
        """
        if old_status == 'etudiant' and hasattr(user, 'student'):
            user.student.delete()
        elif old_status == 'professeur' and hasattr(user, 'professor'):
            user.professor.delete()
        elif old_status == 'personnel' and hasattr(user, 'personnel'):
            user.personnel.delete()

class StudentViewSet(AbstractViewSet):
    """
    ViewSet pour gérer les étudiants selon différents contextes
    """
    http_method_names = ("get", "post", "put", "patch", "delete")
    permission_classes = (IsAuthenticated, UserPermission)
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__first_name', 'user__last_name']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return StudentUpdateSerializer
        return StudentDetailSerializer

    def get_queryset(self):
        queryset = Student.objects.select_related(
            'user', 
            'study', 
            'school', 
            'peer'
        )

        if self.basename == "user-student":
            return queryset.filter(user__public_id=self.kwargs.get("user__pk"))
    
        peer_id = self.request.query_params.get('peer')
        if peer_id:
            queryset = queryset.filter(peer__public_id=peer_id)

            # Appliquer la recherche si présente
            search = self.request.query_params.get('search', '').strip()
            if search:
                # Diviser les termes de recherche
                search_terms = search.split()
                q_objects = Q()
                
                for term in search_terms:
                    q_objects |= (
                        Q(user__first_name__icontains=term) |
                        Q(user__last_name__icontains=term)
                    )
                
                queryset = queryset.filter(q_objects)

        return queryset.distinct()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    def get_object(self):
        """
        Récupère l'objet selon le contexte
        """
        
        obj = Student.objects.get_object_by_public_id(self.kwargs.get("pk"))
        self.check_object_permissions(self.request, obj)
        return obj

    def create(self, request, *args, **kwargs):
        """
        Création d'un profil étudiant
        """
        if self.basename == "user-student":
            try:
                user = User.objects.get_object_by_public_id(self.kwargs.get('user__pk'))
                
                if hasattr(user, 'student'):
                    return Response(
                        {"detail": "Un profil étudiant existe déjà pour cet utilisateur."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                student = serializer.save(user=user)
                
                # Retourner avec le sérialiseur détaillé
                return Response(
                    StudentDetailSerializer(student).data,
                    status=status.HTTP_201_CREATED
                )
            
            except User.DoesNotExist:
                return Response(
                    {"detail": "Utilisateur non trouvé."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                logger.error(f"Erreur lors de la création du profil étudiant: {str(e)}")
                return Response(
                    {"detail": str(e)}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """
        Mise à jour d'un profil étudiant
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
            
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """
        Mise à jour partielle d'un profil étudiant
        """
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Suppression douce d'un profil étudiant
        """
        instance = self.get_object()
        for field in instance._meta.fields:
            if field.name not in ['id', 'user']:
                setattr(instance, field.name, field.get_default())
        instance.save()
        return Response(
            StudentDetailSerializer(instance).data,
            status=status.HTTP_200_OK
        )

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
        queryset = Professor.objects.select_related('user').prefetch_related('school', 'study')

        # Filtrage par utilisateur
        if self.basename == "user-professor":
            return queryset.filter(user__public_id=self.kwargs.get("user__pk"))

        # Filtrage par école
        if self.basename == "school-professor":
            return queryset.filter(school__public_id=self.kwargs.get("school__pk"))

        # Filtrage par filière
        if self.basename == "study-professor":
            return queryset.filter(study__public_id=self.kwargs.get("study__pk"))

        return queryset

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
    http_method_names = ("post", "get", "put", "delete")
    permission_classes = (UserPermission,)
    serializer_class = ServiceSerializer
    filter_backends = [filters.SearchFilter, django_filters.DjangoFilterBackend]
    search_fields = [
        'label',
        'description',
        'manager__first_name',
        'manager__last_name'
    ]
    ordering_fields = ['created', 'label']
    ordering = ['-created']

    def get_queryset(self):
        queryset = Service.objects.select_related(
            'manager'
        )
        
        user_pk = self.kwargs.get("user__pk")
        school_pk = self.kwargs.get("school__pk")
        
        if user_pk:
            return queryset.filter(manager__public_id=user_pk)
        if school_pk:
            return queryset.filter(school__public_id=school_pk)
            
        return queryset

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Statistiques sur les services
        """
        if not request.user.is_superuser:
            return Response(
                {"detail": "Accès non autorisé"},
                status=status.HTTP_403_FORBIDDEN
            )

        queryset = Service.objects.all()
        stats = {
            'total': queryset.count(),
            'active': queryset.filter(is_active=True).count(),
            'inactive': queryset.filter(is_active=False).count(),
        }

        return Response(stats)

    def get_object(self):
        obj = Service.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

class PeerViewSet(AbstractViewSet):
    """
    ViewSet pour gérer les promotions (Peer)
    """
    http_method_names = ("post", "get", "patch")
    permission_classes = (IsAuthenticated,)
    filter_backends = [filters.SearchFilter]
    search_fields = ['label']

    def get_serializer_class(self):
        if self.action == 'list':
            return PeerSearchSerializer
        return PeerSerializer

    def get_queryset(self):
        return Peer.objects.select_related(
            'study', 
            'school', 
            'manager'
        ).prefetch_related(
            'students',
            'students__user'
        )

    def get_object(self):
        try:
            obj = Peer.objects.get_object_by_public_id(self.kwargs["pk"])
            self.check_object_permissions(self.request, obj)
            return obj
        except Peer.DoesNotExist:
            raise NotFound("Cette promotion n'existe pas.")
        
    # @action(detail=True, methods=['post'], url_path='create-post')
    # def create_post(self, request, pk=None):
    #     """
    #     Permet au manager de créer une publication pour la promotion
    #     """
    #     peer = self.get_object()

    #     # Vérifier que l'utilisateur est le manager actuel
    #     if request.user.student != peer.manager:
    #         return Response(
    #             {"detail": "Seul le délégué actuel peut créer des publications pour la promotion"},
    #             status=status.HTTP_403_FORBIDDEN
    #         )

    #     # Créer la publication
    #     serializer = GeneralPostSerializer(data=request.data, context={'request': request})
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save(peer_posts=peer, source='promotion')

    #     return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def check_existence(self, request):
        """Vérifie si une promo existe pour l'étudiant connecté"""
        try:
            student = request.user.student
            peer = Peer.get_for_student(student)
            
            return Response({
                'exists': bool(peer),
                'peer': PeerSerializer(peer).data if peer else None
            })
        except:
            return Response(
                {"detail": "Vous n'êtes pas étudiant"},
                status=status.HTTP_403_FORBIDDEN
            )



    @action(detail=True, methods=['post'], url_path='delegate-manager')
    def delegate_manager(self, request, *args, **kwargs):
        """
        Déléguer le rôle de manager à un autre étudiant de la promotion
        """
        peer = self.get_object()
        
        # Vérifier que l'utilisateur est le manager actuel
        try:
            if request.user.student != peer.manager:
                return Response(
                    {"detail": "Seul le délégué actuel peut transférer son rôle"},
                    status=status.HTTP_403_FORBIDDEN
                )
        except:
            return Response(
                {"detail": "Vous n'êtes pas étudiant"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = PeerDelegationSerializer(
            peer,
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            new_manager = serializer.validated_data['new_manager']
            
            # Effectuer le transfert
            peer.manager = new_manager
            peer.save()
            
            # Retourner les données mises à jour
            return Response(
                PeerSerializer(
                    peer,
                    context={'request': request}
                ).data
            )
            
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        """
        Endpoint pour l'affichage initial des étudiants d'une promotion
        """
        try:
            peer = self.get_object()
            students = Student.objects.filter(peer=peer).select_related(
                'user', 
                'study', 
                'school'
            )
            
            page = self.paginate_queryset(students)
            serializer = StudentDetailSerializer(
                page, 
                many=True,
                context={'request': request}
            )
            
            return self.get_paginated_response(serializer.data)
        except Exception as e:
            logger.error(f"Erreur lors de la récupération des étudiants: {str(e)}")
            return Response(
                {"detail": "Une erreur s'est produite."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def posts(self, request, pk=None):
        """Récupérer les posts de la promo avec pagination"""
        peer = self.get_object()
        
        # Vérifier que l'utilisateur a accès aux posts
        if not (request.user.student.peer == peer or request.user.student == peer.manager):
            return Response(
                {"detail": "Vous n'avez pas accès aux publications de cette promo"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Filtrer les posts de la promo
        posts = GeneralPost.objects.filter(
            source='promotion',
            peer_posts=peer
        ).select_related(
            'author'  # Optimisation des requêtes
        ).prefetch_related(
            'likes'   # Optimisation des requêtes
        ).order_by('-created')

        page = self.paginate_queryset(posts)
        serializer = GeneralPostSerializer(
            page, 
            many=True,
            context={'request': request}
        )
        return self.get_paginated_response(serializer.data)


    


