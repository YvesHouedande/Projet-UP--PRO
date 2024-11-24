from rest_framework_nested import routers
from core.author.viewsets import (
    UserViewSet, ServiceViewSet,
    PeerViewSet, StudentViewSet, 
    ProfessorViewSet, PersonnelViewSet,
)
from core.content.viewsets import (
    GeneralPostViewSet, CommentViewset, 
    EventViewSet,
)

from core.auth.viewsets import (
    RegisterViewSet, LoginViewSet, 
    RefreshViewSet, LogoutViewSet,
    LoginGoogleViewSet, SendValidationCodeToEmailViewSet,
    ValidateEmailCodeViewSet,
)
from core.center.viewsets import (
    SchoolViewSet, StudyViewSet
    )
from core.request.viewsets import RequestViewSet

router = routers.SimpleRouter()
################################# auth ##########################
router.register(r"auth/register", RegisterViewSet, basename="auth-register")
router.register(r"auth/login", LoginViewSet, basename="auth-login")
router.register(r"auth/refresh", RefreshViewSet, basename="auth-refresh")
router.register(r"auth/logout", LogoutViewSet, basename="auth-logout")
router.register(r"auth/google/login", LoginGoogleViewSet, basename="google-auth-logout")
    
router.register(r'send-validation-code-to-email', SendValidationCodeToEmailViewSet, basename='send-validation-email')
router.register(r'validate-email-code', ValidateEmailCodeViewSet, basename='validate-email-code')


################################# Content Management ##########################
router.register(r"general_post", GeneralPostViewSet, basename="general_post")# return all 

router.register(r"event", EventViewSet, basename="event")

general_post = routers.NestedSimpleRouter(router, r"general_post", lookup="post")
general_post.register(r"comment", CommentViewset, basename="post-comment")

#################################Author Management ##########################
router.register(r"user", UserViewSet, basename="user")#all user
user = routers.NestedSimpleRouter(router, r"user", lookup="user")
user.register(r"service", ServiceViewSet, basename="user-service")
user.register(r"friends", UserViewSet, basename="user-friend")
user.register(r"general_post", GeneralPostViewSet, basename="user-post")
user.register(r"event", EventViewSet, basename="user-event")

# Ajoutez ces nouvelles routes pour gérer les informations INP
user.register(r"student", StudentViewSet, basename="user-student")
user.register(r"professor", ProfessorViewSet, basename="user-professor")
user.register(r"personnel", PersonnelViewSet, basename="user-personnel")

router.register(r"student", StudentViewSet, basename="student")
router.register(r"professor", ProfessorViewSet, basename="professor")
router.register(r"personnel", PersonnelViewSet, basename="personnel")

#router.register(r"study/students", StudentViewSet, basename="study-students")################
################ peer->data ################ 
router.register(r"peer", PeerViewSet, basename="peer")
peer = routers.NestedSimpleRouter(router, r"peer", lookup="peer")
peer.register(r"general_post", GeneralPostViewSet, basename="peer-post")
# peer.register(r"position", PeerPositionViewSet, basename="peer-position")
peer.register(r"student", StudentViewSet, basename="peer-students") 

################service->data ################ 
router.register(r"service", ServiceViewSet, basename="service")#service viewset
service = routers.NestedSimpleRouter(router, r"service", lookup="service")
service.register(r"event", EventViewSet, basename="service-event")

################################# Center Management later ##########################
################ school->data ################  
router.register(r"school", SchoolViewSet, basename="school")#
school = routers.NestedSimpleRouter(router, r"school", lookup="school")
school.register(r"student", StudentViewSet, basename="school-student")
school.register(r"professor", ProfessorViewSet, basename="school-professor")
school.register(r"personnel", PersonnelViewSet, basename="school-personnel") 
school.register(r"service", ServiceViewSet, basename="school-service") 

################ study->data ################ 
router.register(r"study", StudyViewSet, basename="study")
study = routers.NestedSimpleRouter(router, r"study", lookup="study")
study.register(r"student", StudentViewSet, basename="study-student") # all student for study 
study.register(r"professor", ProfessorViewSet, basename="study-professor")
study.register(r"personnel", PersonnelViewSet, basename="study-personnel") 

router.register(r"requests", RequestViewSet, basename="request")

urlpatterns = [
    *router.urls, *general_post.urls,
    *service.urls, *peer.urls, 
    *study.urls, *school.urls,
    *user.urls,
]  
