from rest_framework_nested import routers
from core.author.viewsets import UserViewSet


router = routers.SimpleRouter()

router.register(r"user", UserViewSet, basename="user") 

urlpatterns = [*router.urls]