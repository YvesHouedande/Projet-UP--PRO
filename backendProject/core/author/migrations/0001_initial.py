# Generated by Django 5.0.2 on 2024-03-17 02:23

import core.utils
import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('core_center', '0001_initial'),
    ]

    operations = [
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
                ('first_name', models.CharField(max_length=255, verbose_name='Nom')),
                ('last_name', models.CharField(max_length=255, verbose_name='Prenom')),
                ('email', models.EmailField(db_index=True, max_length=254, unique=True)),
                ('is_active', models.BooleanField(default=True, verbose_name='est actif')),
                ('is_superuser', models.BooleanField(default=False, verbose_name='est admin')),
                ('is_staff', models.BooleanField(default=False, verbose_name='est staff')),
                ('bio', models.TextField(blank=True, null=True)),
                ('avatar', models.ImageField(blank=True, null=True, upload_to=core.utils.user_directory_path, verbose_name='Image Profile')),
                ('follows', models.ManyToManyField(related_name='followed_by', to=settings.AUTH_USER_MODEL, verbose_name='Abonnés')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'Utilisateur',
            },
        ),
        migrations.CreateModel(
            name='Personnel',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('job', models.CharField(blank=True, max_length=255, null=True)),
                ('administration', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'abstract': False,
            },
            bases=('core_author.user',),
        ),
        migrations.CreateModel(
            name='Peer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('label', models.CharField(max_length=255, verbose_name='Nom de la Promo')),
                ('description', models.TextField()),
                ('year', models.DateField(verbose_name='année')),
                ('cover', models.ImageField(blank=True, null=True, upload_to='Peer/')),
                ('study', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core_center.study', verbose_name='Filière')),
            ],
            options={
                'verbose_name': 'Promotion',
            },
        ),
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('label', models.CharField(max_length=255, verbose_name='Service')),
                ('cover', models.ImageField(blank=True, null=True, upload_to='Service/', verbose_name='Image de couverture')),
                ('ttype', models.CharField(blank=True, choices=[('communnuty', 'COMMUNAUTE'), ('administration', 'ADMINISTRATION')], max_length=255, null=True, verbose_name='type de service')),
                ('description', models.TextField(blank=True, null=True)),
                ('follows', models.ManyToManyField(blank=True, related_name='services_followed', to=settings.AUTH_USER_MODEL, verbose_name='Abonnes')),
                ('manager', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Gerant')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Professor',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('subject', models.CharField(max_length=255, verbose_name='matière')),
                ('school', models.ManyToManyField(to='core_center.school', verbose_name='ecole')),
            ],
            options={
                'verbose_name': 'Professeur',
            },
            bases=('core_author.user',),
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('level_choices', models.CharField(choices=[('ts1', 'TS1'), ('ts2', 'TS2'), ('ts3', 'TS3'), ('eng1', 'ING1'), ('eng2', 'ING2'), ('eng3', 'ING3'), ('master1', 'Master1'), ('master2', 'Master2')], max_length=10, null=True, verbose_name='Niveau')),
                ('bac_year', models.DateField(blank=True, null=True, verbose_name='Année du bac')),
                ('peer', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='students', to='core_author.peer', verbose_name='Promotion')),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='students', to='core_center.school', verbose_name='Ecole')),
                ('study', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='students', to='core_center.study', verbose_name='Filière')),
            ],
            options={
                'verbose_name': 'Etudiant',
            },
            bases=('core_author.user',),
        ),
        migrations.CreateModel(
            name='PeerUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('position', models.CharField(blank=True, max_length=255, null=True)),
                ('peer', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core_author.peer')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core_author.student')),
            ],
            options={
                'verbose_name': 'EtudiantPromo',
            },
        ),
        migrations.AddField(
            model_name='peer',
            name='manager',
            field=models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='peer_managed', to='core_author.student', verbose_name='Gerant'),
        ),
    ]
