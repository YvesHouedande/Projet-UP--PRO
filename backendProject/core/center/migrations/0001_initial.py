# Generated by Django 5.0.6 on 2024-11-29 14:57

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='School',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('label', models.CharField(max_length=255, unique=True, verbose_name='Nom:')),
                ('description', models.TextField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Ecole',
            },
        ),
        migrations.CreateModel(
            name='Study',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('label', models.CharField(max_length=255, unique=True, verbose_name='Nom:')),
                ('school', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core_center.school', verbose_name='Ecole')),
            ],
            options={
                'verbose_name': 'Filière',
            },
        ),
    ]
