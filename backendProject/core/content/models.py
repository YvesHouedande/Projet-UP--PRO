from django.db import models

from core.abstract.models import AbstractModel, AbstractManager


class CommentManager(AbstractManager):
    pass

class Comment(AbstractModel):
    post = models.ForeignKey("Post", on_delete=models.CASCADE)
    author = models.ForeignKey("core_author.User", on_delete=models.CASCADE)

    body = models.TextField()
    edited = models.BooleanField(default=False)

    objects = CommentManager()

    def __str__(self):
        return self.author.name
    



class PostManager(AbstractManager):
    pass

class Post(AbstractModel):
    author = models.ForeignKey(to="core_author.User", on_delete=models.CASCADE)
    body = models.TextField()
    edited = models.BooleanField(default=False)

    objects = PostManager()
 
    def __str__(self):
        return f"{self.author.name}"
