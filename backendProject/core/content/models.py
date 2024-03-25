from django.db import models
from core.abstract.models import AbstractModel, AbstractManager, AbstractPostCommon


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
        return f"commentaire: {self.public_id}, Post: {self.post.title}"
     

#####################
class PostManager(AbstractManager):
    pass

class GeneralPost(AbstractModel):
    title = models.CharField(max_length=100, verbose_name="Titre")
    author = models.ForeignKey(to="core_author.User", on_delete=models.CASCADE, verbose_name="Auteur")
    likes = models.ManyToManyField(to="core_author.User", related_name='posts',blank=True) 

    objects = PostManager()

    def __str__(self):
        return f"{self.title}"
    
class PostUser(GeneralPost, AbstractPostCommon):
    class Meta:
        verbose_name = "PostUtilisateur"

    objects = PostManager()



class PostPeerManager(AbstractManager):
    pass
class PostPeer(GeneralPost, AbstractPostCommon):
    peer = models.ForeignKey("core_author.Peer", on_delete=models.CASCADE, verbose_name="Promotion", related_name="posts", null=True, blank=True)
    class Meta:
        verbose_name = "PostPromo"

    # objects = PostPeerManager

class PostService(GeneralPost, AbstractPostCommon):
    service = models.ForeignKey("core_author.Service", on_delete=models.CASCADE, verbose_name="Service", related_name="posts") 
    class Meta:
        verbose_name = "PostService"

    objects = PostManager()
    
    def __str__(self):
        return self.title


class Event(AbstractModel):
    label = models.CharField(max_length=255, verbose_name="Titre", null=True, blank=True)
    service = models.ForeignKey("core_author.Service", on_delete=models.CASCADE)
    moment = models.DateTimeField(null=True, blank=True)
    place = models.CharField(max_length=255, null=True, blank=True, verbose_name="Lieu")
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.label
    
    class Meta:
        verbose_name = "Evénement"


  