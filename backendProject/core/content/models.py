from django.db import models
from core.abstract.models import AbstractModel, AbstractManager, AbstractPostCommon
from core.author.models import (
    Student, Professor, Personnel
)

from django.conf import settings
from core.utils import post_like_actions



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
     

#####################
class PostManager(AbstractManager):
    pass

class GeneralPost(AbstractModel):
    title = models.CharField(max_length=100, verbose_name="Titre")
    author = models.ForeignKey(to="core_author.User", on_delete=models.CASCADE, verbose_name="Auteur")
    likes = models.ManyToManyField(to="core_author.User", related_name='posts', blank=True) 

    objects = PostManager()

    def __str__(self):
        return f"{self.title}"
    
    def is_popular(self):
        return self.likes.count() > settings.POPULARITY_THRESHOLD
    
class PostUser(GeneralPost, AbstractPostCommon):
    class Meta:
        verbose_name = "PostUtilisateur"

    objects = PostManager()

    def post_type(self):
        student = Student.objects.filter(public_id=self.author.public_id).first()
        professor = Professor.objects.filter(public_id=self.public_id).first()
        personnel = Personnel.objects.filter(public_id=self.public_id).first()
        
        if student:
            return "Etudiant"
        if professor:
            return "Professeur"
        if personnel:
            return "Staff"
    
    def post_like_actions(self):
        return post_like_actions(self, "post_user")
        


class PostPeerManager(AbstractManager):
    pass
class PostPeer(GeneralPost, AbstractPostCommon):
    peer = models.ForeignKey("core_author.Peer", on_delete=models.CASCADE, verbose_name="Promotion", related_name="posts", null=True, blank=True)
    class Meta:
        verbose_name = "PostPromo"

    def post_type(self):
        return "Promo"

    def post_like_actions(self):
        return post_like_actions(self, "post_peer")
    


    # objects = PostPeerManager

class PostService(GeneralPost, AbstractPostCommon):
    service = models.ForeignKey("core_author.Service", on_delete=models.CASCADE, verbose_name="Service", related_name="posts") 
    class Meta:
        verbose_name = "PostService"

    objects = PostManager()
    
    def __str__(self):
        return self.title
    
    def post_type(self):
        return "Adminitration" if self.service.school_exist() else "Comunautaire"
    
    def post_like_actions(self):
        return post_like_actions(self, "post_service")


class Event(AbstractModel):
    label = models.CharField(max_length=255, verbose_name="Titre", null=True, blank=True)
    service = models.ForeignKey("core_author.Service", related_name='events', on_delete=models.CASCADE)
    moment = models.DateTimeField(null=True, blank=True)
    place = models.CharField(max_length=255, null=True, blank=True, verbose_name="Lieu")
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Event: {self.label}, service: {self.service.label}"
    
    class Meta:
        verbose_name = "Evénement"


  