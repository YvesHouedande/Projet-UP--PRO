from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from core.abstract.models import AbstractModel, AbstractManager
from core.utils import user_directory_path
from core.abstract.models import  AbstractManager
import random
import string
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator




class UserManager(BaseUserManager, AbstractManager):
    def create_user(self, email, password=None, model_name=None, **extra_fields):
        if not email:
            raise ValueError('L\'adresse email est obligatoire.')
        email = self.normalize_email(email)
        
        # Utiliser l'email comme username
        extra_fields.setdefault('username', email)
        
        if model_name == 'professor':
            user = Professor(email=email, **extra_fields)
        elif model_name == 'student':
            user = Student(email=email, **extra_fields)
        else:
            user = self.model(email=email, **extra_fields)
        
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **kwargs):
        if password is None:
            raise TypeError("Superusers must have a password.")
        if email is None:
            raise TypeError("Superusers must have an email.")

        user = self.create_user(email=email, password=password, **kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user
    

class User(AbstractModel, AbstractBaseUser, PermissionsMixin):
    STATUS_CHOICES = (
        ('etudiant', "ETUDIANT"),
        ('professeur', "PROFESSEUR"),
        ('personnel', "PERSONNEL"),
        ('autre', "AUTRE"),
    )
    username = models.CharField(db_index=True, max_length=255, unique=True, verbose_name="Nom Utilisateur")
    first_name = models.CharField(max_length=255, verbose_name="Nom", null=True)
    last_name = models.CharField(max_length=255, verbose_name="Prenom", null=True)
    status_choice = models.CharField(choices = STATUS_CHOICES, max_length=15, verbose_name="statut")

    number = models.CharField(max_length=10, verbose_name="Contact", null=True, blank=True) 
    email = models.EmailField(db_index=True, unique=True)
    inp_mail = models.EmailField(db_index=True, unique=True, null=True)
    from_inp = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True, verbose_name="est actif")
    is_superuser = models.BooleanField(default=False, verbose_name="est admin")
    is_staff = models.BooleanField(default=False, verbose_name="est staff")
    validation_code = models.CharField(null=True, blank=True, max_length=6)

    bio = models.TextField(null=True, blank=True)
    avatar = models.ImageField(null=True, blank=True, upload_to=user_directory_path, verbose_name="Image Profile")
    follows = models.ManyToManyField("self", related_name="followed_by", symmetrical=False, verbose_name="Abonnés", blank=True)
    
    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"       
    REQUIRED_FIELDS = []  # Retirez "email" d'ici car il est déjà le USERNAME_FIELD

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
    
    def _generate_validation_code(self):
        """Génère un code de validation aléatoire"""
        code = ''.join(random.choices(string.digits, k=6))
        self.validation_code = code
        self.save()
        return code

    def send_validation_email(self):
        """Envoie un email de validation à l'utilisateur"""
        if self.inp_mail:
            print("----------------------------Envoie du Mail-------------------------------")
            code = self._generate_validation_code()
            send_mail(
                'Votre code de validation INP',
                f'Voici votre code de validation: {code}',
                settings.DEFAULT_FROM_EMAIL,
                [self.inp_mail],
                fail_silently=False,
            )

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)


class Student(AbstractModel):
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
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    study = models.ForeignKey("core_center.Study", on_delete=models.SET_NULL, null=True, blank=True)
    school = models.ForeignKey("core_center.School", on_delete=models.CASCADE)
    level_choices = models.CharField(choices=LEVEL_CHOICES, max_length=10, null=True, verbose_name="Niveau")
    peer = models.ForeignKey(
        "Peer",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="students"
    )
    bac_year = models.IntegerField(
        verbose_name="Année du bac",
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1990),  # année minimum acceptable
            MaxValueValidator(2030)   # année maximum acceptable
        ]
    )
    class Meta:
        verbose_name="Etudiant"
        abstract = False

    def get_email(self):
        return self.user_ptr

    def __str__(self):
        return f"email: {self.user.email}, school: {self.school}, study: {self.study}"
    

class Professor(AbstractModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255, verbose_name="matière")
    school = models.ManyToManyField("core_center.School", verbose_name="ecole")
    study = models.ManyToManyField("core_center.Study", verbose_name="Filière")

    class Meta:
        verbose_name="Professeur"
        abstract = False

    def __str__(self) -> str:
        return f"{self.user.email}"
    

class Personnel(AbstractModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    job = models.CharField(max_length=255, null=True, blank=True)
    administration =  models.CharField(max_length=255, null=True, blank=True)
    school = models.ForeignKey("core_center.School", verbose_name="ecole", null=True, blank=True, on_delete=models.CASCADE)
    study = models.ForeignKey("core_center.Study" , verbose_name="Filière", on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        verbose_name="Personnel"
        abstract = False

class Peer(AbstractModel):
    label = models.CharField(max_length=255, unique=True)
    study = models.ForeignKey("core_center.Study", on_delete=models.CASCADE)
    school = models.ForeignKey("core_center.School", on_delete=models.CASCADE)
    year = models.IntegerField()
    cover = models.ImageField(upload_to='peer/', null=True, blank=True)
    manager = models.OneToOneField(
        "Student", 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="managed_peer"
    )
    posts = models.ManyToManyField(
        'core_content.GeneralPost',
        related_name='peer_posts',
        blank=True
    )

    def clean(self):
        # Vérifier si une promotion existe déjà pour cette filière cette année
        current_year = timezone.now().year
        if Peer.objects.filter(
            study=self.study,
            year=current_year
        ).exists() and not self.pk:
            raise ValidationError("Une promotion existe déjà pour cette filière cette année")

    def save(self, *args, **kwargs):
        if not self.pk:  # Nouveau Peer
            # Ne pas convertir year en datetime
            if not self.label:
                self.label = f"{self.study.label}{str(self.year)[2:]}"
        super().save(*args, **kwargs)

    @classmethod
    def exists_for_student(cls, student):
        """Vérifie si une promo existe pour la filière/année de l'étudiant"""
        current_year = timezone.now().year
        return cls.objects.filter(
            study=student.study,
            year__year=current_year
        ).exists()

    @classmethod
    def get_for_student(cls, student):
        """Récupère la promo correspondante à l'étudiant"""
        current_year = timezone.now().year
        return cls.objects.filter(
            study=student.study,
            year__year=current_year
        ).first()


    def create_post(self, author, title=None, content=None, content_type=None, image=None, source=None):
        """Créer un post au nom de la promo"""
        from core.content.models import GeneralPost
        post = GeneralPost.objects.create(
            author=author,
            source='promotion',
            title=title,
            content=content,
            content_type=content_type,
            image=image,  
        )
        self.posts.add(post)
        return post

    class Meta:
        verbose_name = "Promotion"
        unique_together = ('study', 'year')

    def __str__(self) -> str:
        return f"{self.label}"
    
class Service(AbstractModel):
    label = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)
    school = models.ForeignKey("core_center.School", on_delete=models.CASCADE, null=True, blank=True)
    manager = models.ForeignKey("core_author.User", on_delete=models.SET_NULL, null=True, blank=True)
    cover = models.ImageField(upload_to='service/', null=True, blank=True)
    posts = models.ManyToManyField(
        'core_content.GeneralPost',
        related_name='service_posts',
        blank=True
    )

    def __str__(self) -> str:
        return f"{self.label}"
    
    def school_exist(self):
        return True if self.school else False
    
    class Meta:
        verbose_name = "Service"
        abstract = False

    def create_post(self, author, **post_data):
        """Crée un post associé au service"""
        from core.content.models import GeneralPost
        post = GeneralPost.objects.create(
            author=author,
            **post_data
        )
        post.service_posts.add(self)
        return post


    
