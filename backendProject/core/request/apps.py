from django.apps import AppConfig


class CommentConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core.request'
    label = 'core_request'
    verbose_name = "Requêtes"
