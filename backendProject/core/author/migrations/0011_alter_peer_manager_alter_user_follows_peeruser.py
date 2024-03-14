# Generated by Django 5.0.2 on 2024-03-05 18:03

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_author', '0010_remove_user_status_choice'),
    ]

    operations = [
        migrations.AlterField(
            model_name='peer',
            name='manager',
            field=models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='peer_managed', to='core_author.student', verbose_name='Gerant'),
        ),
        migrations.AlterField(
            model_name='user',
            name='follows',
            field=models.ManyToManyField(related_name='followed_by', to=settings.AUTH_USER_MODEL, verbose_name='Abonnés'),
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
                'abstract': False,
            },
        ),
    ]