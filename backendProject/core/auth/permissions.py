from rest_framework.permissions import BasePermission, SAFE_METHODS


class UserPermission(BasePermission):
    #pour les accès
    def has_object_permission(self, request, view, obj):
        #Must be connected to see all data
        if request.user.is_anonymous:
            return False
            return request.method in SAFE_METHODS

        if view.basename in ["post_user", "post_peer", "post_service",
                              "general_post", "peer", "peer-position",
                              "school", "student", "study-student",
                              "study-professor", "professor", "personnel",
                              "study-personnel", "peer-student", "user-service"
                              ]:
            return bool(request.user and request.user.is_authenticated)
        
        #must manage the service
        if view.basename in ["service"]:
            return bool(request.user and obj.manager==request.user)
        
        # if view.basename in ["service-event"]:
        #     return bool(request.user and obj.manager==request.user)
        
        if view.basename in ["post-comment"]:
            if request.method in ["DELETE"]:
                return bool(
                    request.user.is_superuser
                    or request.user in [obj.author, obj.post.author]
                )

            return bool(request.user and request.user.is_authenticated)

        if view.basename in ["user"]:
            if request.method in SAFE_METHODS:
                return True
            return bool(request.user.id == obj.id)

        return False

    def has_permission(self, request, view):
        #must be connected to sse all data
        if request.user.is_anonymous:
            return False
        if view.basename in [
            "general_post", "post_user", "post_service", "post_peer",
            "post-comment","service","service-event", "event", "user", "auth-logout",
            "peer","peer-position", "school", "study", "student", "study-student",
            "professor", "study-professor", "personnel", "study-personnel", "school-professor",
            "school-personnel", "school-service", "school-student", "peer-student", "user-service"
                            ]:
            if request.user.is_anonymous:
                return request.method in SAFE_METHODS

            return bool(request.user and request.user.is_authenticated)
        return False
