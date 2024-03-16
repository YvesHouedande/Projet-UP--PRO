from rest_framework_nested import routers
from core.author.viewsets import UserViewSet
from core.content.viewsets import (
    GeneralPostViewSet, PostServiceViewSet,
    PostUserViewSet, PostPeerViewSet, CommentViewset)


router = routers.SimpleRouter()

router.register(r"user", UserViewSet, basename="user")
router.register(r"general_post", GeneralPostViewSet, basename="general_post")

router.register(r"post_user", PostUserViewSet, basename="post_user")
router.register(r"post_service", PostServiceViewSet, basename="post_service")
router.register(r"post_peer", PostPeerViewSet, basename="post_peer")






posts_router = routers.NestedSimpleRouter(router, r"general_post", lookup="post")
posts_router.register(r"comment", CommentViewset, basename="post-comment")


urlpatterns = [*router.urls]