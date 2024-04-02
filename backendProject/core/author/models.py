
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from core.abstract.models import AbstractModel, AbstractManager
from core.utils import user_directory_path




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
    # STATUS_CHOICES = (
    #     ('student', 'student'),
    #     ('professor', 'professor'),
    #     ('personnel', 'personnel'),
    # )
    username = models.CharField(db_index=True, max_length=255, unique=True, verbose_name="Nom Utilisateur")
    first_name = models.CharField(max_length=255, verbose_name="Nom")
    last_name = models.CharField(max_length=255, verbose_name="Prenom")
    # status_choice = models.CharField(choices = STATUS_CHOICES, max_length=10, verbose_name="statut")

    email = models.EmailField(db_index=True, unique=True)
    is_active = models.BooleanField(default=True, verbose_name="est actif")
    is_superuser = models.BooleanField(default=False, verbose_name="est admin")
    is_staff = models.BooleanField(default=False, verbose_name="est staff")

    bio = models.TextField(null=True, blank=True)
    avatar = models.ImageField(null=True, blank=True, upload_to=user_directory_path, verbose_name="Image Profile")
    follows = models.ManyToManyField("self", related_name="followed_by", symmetrical=False, verbose_name="Abonnés", blank=True)
    #posts_liked = models.ManyToManyField("core_content.PostUser", related_name="liked_by")
    

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"       
    REQUIRED_FIELDS = ["email"]

    objects = UserManager()

    class Meta:
        verbose_name= "Utilisateur"
    def __str__(self):
        return f"{self.email}"

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"

    def like_post(self, post):
        """Like `post` if it hasn't been done yet"""
        return post.likes.add(self)

    def unlike_post(self, post):
        """Remove a like from a `post`"""
        return post.likes.remove(self)

    def has_liked_post(self, post):
        """Return True if the user has liked a `post`; else False"""
        return self.posts_liked.filter(pk=post.pk).exists()


class Student(User):
    LEVEL_CHOICES = (
        ('ts1', "TS1"),
        ('ts2', "TS2"),
        ('ts3', "TS3"),

        ("eng1", "ING1"),
        ("eng2", "ING2"),
        ("eng3", "ING3"),

        ("master1", "Master1"),
        ("master2", "Master2"),
    )
    study = models.ForeignKey("core_center.Study", on_delete=models.PROTECT, related_name="students", verbose_name="Filière")
    school = models.ForeignKey("core_center.School", on_delete=models.PROTECT, related_name="students", verbose_name="Ecole")
    level_choices = models.CharField(choices=LEVEL_CHOICES, max_length=10, null=True, verbose_name="Niveau")
    peer = models.ForeignKey("Peer", on_delete=models.PROTECT, null=True, blank=True, related_name="students", verbose_name="Promotion")
    bac_year = models.DateField(null=True, blank=True, verbose_name="Année du bac")
    class Meta:
        verbose_name="Etudiant"
 

class Peer(AbstractModel):
    label = models.CharField(max_length=255, verbose_name="Nom de la Promo")
    study = models.ForeignKey("core_center.Study", on_delete=models.PROTECT, verbose_name="Filière")
    description = models.TextField()
    manager = models.OneToOneField("Student", on_delete=models.PROTECT, related_name="peer_managed", verbose_name='Gerant')
    year = models.DateField(verbose_name="année")
    cover = models.ImageField(null=True, blank=True, upload_to="Peer/")
    follows = models.ManyToManyField("User", related_name="P_followed_by", symmetrical=False, verbose_name="Abonnés", blank=True)

    def add_student(self,  student:Student=None):
        student.peer = self

    class Meta:
        verbose_name = "Promotion"
    
    def __str__(self) -> str:
        return f"{self.label}"
    

  
class Professor(User):
    subject = models.CharField(max_length=255, verbose_name="matière")
    school = models.ManyToManyField("core_center.School", verbose_name="ecole")
    class Meta:
        verbose_name="Professeur"

    def __str__(self) -> str:
        return f"{self.email}"

class Service(AbstractModel):
    # SERVICE_CHOICES = (
    #     ("communnuty", "COMMUNAUTE"),
    #     ("school", "ADMINISTRATION")
    # )

    label = models.CharField(max_length=255, verbose_name="Service") 
    cover = models.ImageField(null=True, blank=True, upload_to="Service/", verbose_name="Image de couverture")
    manager = models.ForeignKey("core_author.User", null=True, blank=True, on_delete=models.CASCADE, verbose_name="Gerant")
    follows = models.ManyToManyField("core_author.User", blank=True, related_name="services_followed", verbose_name="Abonnes")
    # ttype = models.CharField(max_length=255, choices = SERVICE_CHOICES, verbose_name="type de service", null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    school = models.ForeignKey("core_center.School", null=True, blank=True, on_delete=models.CASCADE)
    follows = models.ManyToManyField("User", related_name="S_followed_by", symmetrical=False, verbose_name="Abonnés", blank=True)


    def __str__(self) -> str:
        return f"{self.label}"
    
    def school_exist(self):
        return True if self.school else False

class Personnel(User):
    job = models.CharField(max_length=255, null=True, blank=True)
    administration =  models.CharField(max_length=255, null=True, blank=True)
    

# link data
class PeerUser(AbstractModel):
    peer = models.ForeignKey("Peer", on_delete=models.PROTECT)
    student = models.ForeignKey("Student", on_delete=models.PROTECT)
    position = models.CharField(max_length=255, null=True, blank=True)
   


    class Meta:
        verbose_name = "EtudiantPromo"

    def __str__(self) -> str:
        return f"{self.student.username}: {self.position}"
    
