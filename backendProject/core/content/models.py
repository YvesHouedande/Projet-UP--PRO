from django.db import models
from core.abstract.models import AbstractModel, AbstractManager, AbstractPostCommon
from core.author.models import (
    Peer, Service
)
from django.conf import settings




class PostManager(AbstractManager):
    pass

class GeneralPost(AbstractModel, AbstractPostCommon):
    title = models.CharField(max_length=100, verbose_name="Titre", null=True)
    author = models.ForeignKey(to="core_author.User", on_delete=models.CASCADE, verbose_name="Auteur")
    likes = models.ManyToManyField(to="core_author.User", related_name='posts', blank=True)
    

    objects = PostManager()

    def __str__(self):
        return f"{self.title}"
    
    def is_popular(self):
        return self.likes.count() > settings.POPULARITY_THRESHOLD
    
    # def get_source(self, pk):
    #     if self.source == "service":
    #         return Service.objects.get(pk=pk) or None
    #     elif self.source == "peer":
    #         return Peer.objects.get(pk=pk) or None
    #     return self.author

    
class Event(AbstractModel):
    label = models.CharField(max_length=255, verbose_name="Titre", null=True, blank=True)
    service = models.ForeignKey("core_author.Service", related_name='events', on_delete=models.CASCADE)
    moment = models.DateTimeField(null=True, blank=True)
    place = models.CharField(max_length=255, null=True, blank=True, verbose_name="Lieu")
    description = models.TextField(null=True, blank=True)
    cover = models.ImageField(upload_to='event/', null=True, blank=True, verbose_name="Image")


    def __str__(self):
        return f"Event: {self.label}, service: {self.service.label}"
    
    class Meta:
        verbose_name = "Evénement"

class CommentManager(AbstractManager):
    pass
class Comment(AbstractModel):
    post = models.ForeignKey("GeneralPost", on_delete=models.CASCADE, verbose_name="Post", null=True, blank=True)
    author = models.ForeignKey("core_author.User", on_delete=models.CASCADE, verbose_name="Auteur", related_name="comments")

    description = models.TextField()
    edited = models.BooleanField(default=False)

    objects = CommentManager()
    class Meta:
        verbose_name="Commentaire"

    def __str__(self):
        return f"Post: {self.post.title[0:25]}, type: {self.post.public_id}"


  