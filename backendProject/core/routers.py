from rest_framework_nested import routers
from core.author.viewsets import UserViewSet
from core.content.viewsets import PostUserViewSet


router = routers.SimpleRouter()

router.register(r"user", UserViewSet, basename="user")
router.register(r"post", PostUserViewSet, basename="post")


urlpatterns = [*router.urls]