from rest_framework_nested import routers
from core.author.viewsets import (
    UserViewSet, ServiceViewSet,
    PeerViewSet, PeerPositionViewSet,
    StudentViewSet, ProfessorViewSet,
    PersonnelViewSet,
)
from core.content.viewsets import (
    GeneralPostViewSet, PostServiceViewSet,
    PostUserViewSet, PostPeerViewSet,
    CommentViewset, EventViewSet,
)
from core.center.viewsets import SchoolViewSet,StudyViewSet #SchoolPersonViewSet 

router = routers.SimpleRouter()
################################# Content Management ##########################
#############related to the connected user
router.register(r"general_post", GeneralPostViewSet, basename="general_post")# return all kind of post:PostUser,PostService... with all data
router.register(r"general_post/filter", GeneralPostViewSet, basename="general_post")#administration or popular

#############Each kind of post
router.register(r"post_user", PostUserViewSet, basename="post_user")
router.register(r"post_service", PostServiceViewSet, basename="post_service")
router.register(r"post_peer", PostPeerViewSet, basename="post_peer")

#############event
router.register(r"event", EventViewSet, basename="event")

#############comments on post
general_post = routers.NestedSimpleRouter(router, r"general_post", lookup="post")
general_post.register(r"comment", CommentViewset, basename="post-comment")

#################################Author Management ##########################
################ user->data ################ 
router.register(r"user", UserViewSet, basename="user")#all user
user = routers.NestedSimpleRouter(router, r"user", lookup="user")
user.register(r"service", ServiceViewSet, basename="user-service")
user.register(r"friends", UserViewSet, basename="user-friend")#all i follow or manage

router.register(r"student", StudentViewSet, basename="student")
router.register(r"professor", ProfessorViewSet, basename="professor")
router.register(r"personnel", PersonnelViewSet, basename="personnel")

#router.register(r"study/students", StudentViewSet, basename="study-students")################
################ peer->data ################ 
router.register(r"peer", PeerViewSet, basename="peer")
peer = routers.NestedSimpleRouter(router, r"peer", lookup="peer")
peer.register(r"position", PeerPositionViewSet, basename="peer-position")
peer.register(r"student", StudentViewSet, basename="peer-student")


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

# router.register(r"school/(?P<schoolname>[^/.]+)", SchoolPersonViewSet, basename="SchoolPerson")#school data

urlpatterns = [
    *router.urls, *general_post.urls,
    *service.urls, *peer.urls, 
    *study.urls, *school.urls,
    *user.urls,
]  