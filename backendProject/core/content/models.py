from django.db import models
from core.utils import get_upload_path

from core.abstract.models import AbstractModel, AbstractManager


class CommentManager(AbstractManager):
    pass

class Comment(AbstractModel):
    post = models.ForeignKey("GeneralPost", on_delete=models.CASCADE, verbose_name="Post", null=True, blank=True)
    author = models.ForeignKey("core_author.User", on_delete=models.CASCADE, verbose_name="Auteur", related_name="comments")

    body = models.TextField()
    edited = models.BooleanField(default=False)

    objects = CommentManager()
    class Meta:
        verbose_name="Commentaire"

    def __str__(self):
        return f"commentaire: {self.id}, Post: {self.post.title}"
     


class PostManager(AbstractManager):
    pass


class GeneralPost(AbstractModel):
    CONTENT_TYPE_CHOICES = [
        ("RAW_TEXT", 'Raw Text'), 
        ("VIDEO", 'Video'),
        ("AUDIO", 'Audio'),
    ]
    title = models.CharField(max_length=100, verbose_name="Titre")
    author = models.ForeignKey(to="core_author.User", on_delete=models.CASCADE, verbose_name="Auteur")
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPE_CHOICES, verbose_name="Type de fichier")
    file = models.FileField(upload_to=get_upload_path, null=True, blank=True, verbose_name="Fichier")
    description = models.TextField()
    edited = models.BooleanField(default=False, verbose_name="edité?")
    likes = models.ManyToManyField(to="core_author.User", related_name='posts',blank=True)

    objects = PostManager()


    def __str__(self):
        return f"{self.title}"
    
class PostUser(GeneralPost):
    class Meta:
        verbose_name = "PostUtilisateur"


class PostPeer(GeneralPost):
    peer = models.ForeignKey("core_author.Peer", on_delete=models.CASCADE, verbose_name="Promotion", related_name="posts", null=True, blank=True)
    class Meta:
        verbose_name = "PostPromo"

class PostService(GeneralPost):
    service = models.ForeignKey("core_author.Service", on_delete=models.CASCADE, verbose_name="Service", related_name="posts") 
    class Meta:
        verbose_name = "PostService"
    
    def __str__(self):
        return self.title


class Event(models.Model):
    label = models.CharField(max_length=255, verbose_name="Titre", null=True, blank=True)
    service = models.ForeignKey("core_author.Service", on_delete=models.CASCADE)
    moment = models.DateTimeField()
    place = models.CharField(max_length=255, null=True, blank=True, verbose_name="Lieu")
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.label
    
    class Meta:
        verbose_name = "Evénement"


  