from django.apps import AppConfig


class UserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core.author'
    label = 'core_author'
    verbose_name = "Createur"
