from django.core.cache import cache
from django.db import models
import uuid
from core.utils import get_upload_path
from django.core.exceptions import ObjectDoesNotExist


def _delete_cached_objects(app_label):
    if app_label == "core_content":
        print("--------------cache vider-------------------")
        cache.delete("post_objects")
    else:
        raise NotImplementedError


class AbstractManager(models.Manager):
    def get_object_by_public_id(self, public_id):
        try:
            instance = self.get(public_id=public_id)
            return instance
        except (ObjectDoesNotExist, ValueError, TypeError):
            return None


class AbstractModel(models.Model):
    public_id = models.UUIDField(
        db_index=True, unique=True, default=uuid.uuid4, editable=False, 
    )
    created = models.DateTimeField(auto_now_add=True, editable=False)
    updated = models.DateTimeField(auto_now=True, editable=False)

    objects = AbstractManager()
 
    class Meta:
        abstract = True

    def save(
            self, force_insert=False, force_update=False, using=None, update_fields=None
        ):
            app_label = self._meta.app_label
            if app_label in ["core_content", ]:
                _delete_cached_objects(app_label)
            return super(AbstractModel, self).save(
                force_insert=force_insert,
                force_update=force_update,
                using=using, 
                update_fields=update_fields,
            )


    def delete(self, using=None, keep_parents=False):
        app_label = self._meta.app_label
        if app_label in ["core_content", ]:
            _delete_cached_objects(app_label)
        return super(AbstractModel, self).delete(using=using, keep_parents=keep_parents)
        

class AbstractPostCommon(models.Model):
    CONTENT_TYPE_CHOICES = [
        ("IMAGE POST", 'Image Post'), 
        ("RICH POST", 'Rich Post'),
        ("SIMPLE POST", 'Simple Post'), 

    ]

    POST_SOURCE_CHOICES = [
        ("etudiant", 'ETUDIANT'), 
        ("professeur", 'PROFESSEUR'),
        ("personnel", 'PERSONNEL'),
        ("service", 'SERVICE'),
        ("promotion", 'PROMOTION'),
        ("autre", 'AUTRE'),

    ]
    content_type = models.CharField(max_length=15, choices=CONTENT_TYPE_CHOICES, verbose_name="Type de post", null=True)
    source = models.CharField(max_length=10, choices=POST_SOURCE_CHOICES, verbose_name="source", null=True)
    image = models.ImageField(upload_to=get_upload_path, null=True, blank=True, verbose_name="Image")
    content = models.TextField(null=True, blank=True, verbose_name="contenu")
    edited = models.BooleanField(default=False, verbose_name="edité?")

    class Meta:
        abstract = True