from django.apps import AppConfig


class CommentConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core.content'
    label = 'core_content'
    verbose_name = "Contenu"
