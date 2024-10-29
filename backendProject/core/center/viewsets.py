from core.abstract.viewsets import AbstractViewSet
from .models import Study, School
from .serializers import SchoolSerializer, StudySerializer
from core.auth.permissions import UserPermission
from django.http.response import Http404

class SchoolViewSet(AbstractViewSet):
    http_method_names = ("post", "get", )
    serializer_class = SchoolSerializer
    permission_classes = (UserPermission, )

    def get_queryset(self):
        return School.objects.all()

    def get_object(self):
        obj = School.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    

class StudyViewSet(AbstractViewSet):
    http_method_names = ("post", "get")
    serializer_class = StudySerializer

    def get_queryset(self):
        study_pk = self.kwargs.get("study__pk")
        if study_pk :
            return Study.objects.filter(study__public_id=study_pk)
        return Study.objects.all()
    
    def get_object(self):
        obj = Study.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    

# class SchoolPersonViewSet(viewsets.ViewSet):
#     permission_classes = [IsAuthenticated]

#     def list(self, request, schoolname=None):
#         if schoolname:
#             schools = School.objects.filter(label__iexact=schoolname)
#             if schools.exists():
#                 school = schools.first()

#                 return Response({"school": school.label, "people": []})
#             else:
#                 return Response({"error": "Aucune école trouvée avec ce nom"}, status=status.HTTP_404_NOT_FOUND)
#         else:
#             return Response({"error": "Paramètre 'schoolname' manquant dans la requête"}, status=status.HTTP_400_BAD_REQUEST)