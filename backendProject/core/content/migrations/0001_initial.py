# Generated by Django 5.0.6 on 2024-10-30 13:38

import core.utils
import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core_author', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('label', models.CharField(blank=True, max_length=255, null=True, verbose_name='Titre')),
                ('moment', models.DateTimeField(blank=True, null=True)),
                ('place', models.CharField(blank=True, max_length=255, null=True, verbose_name='Lieu')),
                ('description', models.TextField(blank=True, null=True)),
                ('cover', models.ImageField(blank=True, null=True, upload_to='event/', verbose_name='Image')),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to='core_author.service')),
            ],
            options={
                'verbose_name': 'Evénement',
            },
        ),
        migrations.CreateModel(
            name='GeneralPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('content_type', models.CharField(choices=[('IMAGE POST', 'Image Post'), ('RICH POST', 'Rich Post'), ('SIMPLE POST', 'Simple Post')], max_length=15, null=True, verbose_name='Type de post')),
                ('source', models.CharField(choices=[('etudiant', 'ETUDIANT'), ('professeur', 'PROFESSEUR'), ('personnel', 'PERSONNEL'), ('service', 'SERVICE'), ('promotion', 'PROMOTION'), ('autre', 'AUTRE')], max_length=10, null=True, verbose_name='source')),
                ('image', models.ImageField(blank=True, null=True, upload_to=core.utils.get_upload_path, verbose_name='Image')),
                ('content', models.TextField(blank=True, null=True, verbose_name='contenu')),
                ('edited', models.BooleanField(default=False, verbose_name='edité?')),
                ('title', models.CharField(max_length=100, null=True, verbose_name='Titre')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Auteur')),
                ('likes', models.ManyToManyField(blank=True, related_name='posts', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('description', models.TextField()),
                ('edited', models.BooleanField(default=False)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to=settings.AUTH_USER_MODEL, verbose_name='Auteur')),
                ('post', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core_content.generalpost', verbose_name='Post')),
            ],
            options={
                'verbose_name': 'Commentaire',
            },
        ),
    ]
