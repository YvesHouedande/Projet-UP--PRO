
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models

from core.abstract.models import AbstractModel, AbstractManager
 

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return "user_{0}/{1}".format(instance.public_id, filename)


class UserManager(BaseUserManager, AbstractManager):
    def create_user(self, username, email, password=None, model_name=None, **extra_fields):
        if not username:
            raise ValueError('Le nom d\'utilisateur est obligatoire.')
        if not email:
            raise ValueError('L\'adresse email est obligatoire.')
        email = self.normalize_email(email)
        
        if model_name == 'professor':
            user = Professor(username=username, email=email, **extra_fields)
        elif model_name == 'student':
            user = Student(username=username, email=email, **extra_fields)
        else:
            user = self.model(username=username, email=email, **extra_fields)
        
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password, **kwargs):
        """
        Create and return a `User` with superuser (admin) permissions.
        """
        if password is None:
            raise TypeError("Superusers must have a password.")
        if email is None:
            raise TypeError("Superusers must have an email.")
        if username is None:
            raise TypeError("Superusers must have an username.")

        user = self.create_user(username, email, password, **kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user
    

class User(AbstractModel, AbstractBaseUser, PermissionsMixin):
    STATUS_CHOICES = (
        ('student', 'Student'),
        ('professor', 'Professor'),
        ('personnel', 'Personnel'),
    )
    username = models.CharField(db_index=True, max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    status_choice = models.CharField(choices = STATUS_CHOICES, max_length=10)

    email = models.EmailField(db_index=True, unique=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    bio = models.TextField(null=True, blank=True)
    avatar = models.ImageField(null=True, blank=True, upload_to=user_directory_path)

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"      
    REQUIRED_FIELDS = ["email"]

    objects = UserManager()

    def __str__(self):
        return f"{self.email}"

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"

    def like_post(self, post):
        """Like `post` if it hasn't been done yet"""
        return self.posts_liked.add(post)

    def remove_like_post(self, post):
        """Remove a like from a `post`"""
        return self.posts_liked.remove(post)

    def has_liked_post(self, post):
        """Return True if the user has liked a `post`; else False"""
        return self.posts_liked.filter(pk=post.pk).exists()

    def like_comment(self, comment):
        """Like `comment` if it hasn't been done yet"""
        return self.comments_liked.add(comment)

    def remove_like_comment(self, comment):
        """Remove a like from a `comment`"""
        return self.comments_liked.remove(comment)

    def has_liked_comment(self, comment):
        """Return True if the user has liked a `comment`; else False"""
        return self.comments_liked.filter(pk=comment.pk).exists()
    

class Student(User):
    LEVEL_CHOICES = (
        ('ts', "TS"),
        ("eng", "eng")
    )
    study = models.ForeignKey("core_center.Study", on_delete=models.PROTECT, related_name="students")
    school = models.ForeignKey("core_center.School", on_delete=models.PROTECT, related_name="students")
    level_choices = models.CharField(choices=LEVEL_CHOICES, max_length=5, null=True)
    peer = models.ForeignKey("Peer", on_delete=models.PROTECT, null=True, related_name="students")
    entry_year = models.DateField(null=True, blank=True)


class Peer(AbstractModel):
    label = models.CharField(max_length=255, verbose_name="Nom de la Promo")
    study = models.ForeignKey("core_center.Study", on_delete=models.PROTECT, verbose_name="Filière")
    description = models.TextField()
    manager = models.OneToOneField("Student", on_delete=models.PROTECT, related_name="related_peer", verbose_name='Gestionnaire')
    year = models.DateField(verbose_name="année")

    def add_student(self,  student:Student=None):
        student.peer = self

    class Meta:
        verbose_name = "Promotion"
        verbose_name_plural = "Promotions"
    
    # def post(for_peer=False):
    #     if for_peer:

  
class Professor(User):
    subject = models.CharField(max_length=255)
    school = models.ManyToManyField("core_center.School")
