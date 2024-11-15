# Generated by Django 5.0.6 on 2024-11-14 16:04

import core.utils
import django.core.validators
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Peer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('label', models.CharField(max_length=255, unique=True)),
                ('year', models.IntegerField()),
                ('cover', models.ImageField(blank=True, null=True, upload_to='peer/')),
            ],
            options={
                'verbose_name': 'Promotion',
            },
        ),
        migrations.CreateModel(
            name='PeerPosition',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('position', models.CharField(blank=True, max_length=255, null=True, unique=True)),
            ],
            options={
                'verbose_name': 'Rôle-Promo',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Personnel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('job', models.CharField(blank=True, max_length=255, null=True)),
                ('administration', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'verbose_name': 'Personnel',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Professor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('subject', models.CharField(max_length=255, verbose_name='matière')),
            ],
            options={
                'verbose_name': 'Professeur',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('label', models.CharField(max_length=255, unique=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('cover', models.ImageField(blank=True, null=True, upload_to='service/')),
            ],
            options={
                'verbose_name': 'Service',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('level_choices', models.CharField(choices=[('ts1', 'TS1'), ('ts2', 'TS2'), ('ts3', 'TS3'), ('eng1', 'ING1'), ('eng2', 'ING2'), ('eng3', 'ING3'), ('master1', 'Master1'), ('master2', 'Master2')], max_length=10, null=True, verbose_name='Niveau')),
                ('bac_year', models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1990), django.core.validators.MaxValueValidator(2030)], verbose_name='Année du bac')),
            ],
            options={
                'verbose_name': 'Etudiant',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('username', models.CharField(db_index=True, max_length=255, unique=True, verbose_name='Nom Utilisateur')),
                ('first_name', models.CharField(max_length=255, null=True, verbose_name='Nom')),
                ('last_name', models.CharField(max_length=255, null=True, verbose_name='Prenom')),
                ('status_choice', models.CharField(choices=[('etudiant', 'ETUDIANT'), ('professeur', 'PROFESSEUR'), ('personnel', 'PERSONNEL'), ('autre', 'AUTRE')], max_length=15, verbose_name='statut')),
                ('number', models.CharField(blank=True, max_length=10, null=True, verbose_name='Contact')),
                ('email', models.EmailField(db_index=True, max_length=254, unique=True)),
                ('inp_mail', models.EmailField(db_index=True, max_length=254, null=True, unique=True)),
                ('from_inp', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True, verbose_name='est actif')),
                ('is_superuser', models.BooleanField(default=False, verbose_name='est admin')),
                ('is_staff', models.BooleanField(default=False, verbose_name='est staff')),
                ('validation_code', models.CharField(blank=True, max_length=6, null=True)),
                ('bio', models.TextField(blank=True, null=True)),
                ('avatar', models.ImageField(blank=True, null=True, upload_to=core.utils.user_directory_path, verbose_name='Image Profile')),
                ('follows', models.ManyToManyField(blank=True, related_name='followed_by', to=settings.AUTH_USER_MODEL, verbose_name='Abonnés')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'Utilisateur',
            },
        ),
    ]
