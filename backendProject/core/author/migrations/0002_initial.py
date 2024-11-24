# Generated by Django 5.0.6 on 2024-11-24 00:03

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core_author', '0001_initial'),
        ('core_center', '0001_initial'),
        ('core_content', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='peer',
            name='posts',
            field=models.ManyToManyField(blank=True, related_name='peer_posts', to='core_content.generalpost'),
        ),
        migrations.AddField(
            model_name='peer',
            name='school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core_center.school'),
        ),
        migrations.AddField(
            model_name='peer',
            name='study',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core_center.study'),
        ),
        migrations.AddField(
            model_name='personnel',
            name='school',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core_center.school', verbose_name='ecole'),
        ),
        migrations.AddField(
            model_name='personnel',
            name='study',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core_center.study', verbose_name='Filière'),
        ),
        migrations.AddField(
            model_name='personnel',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='professor',
            name='school',
            field=models.ManyToManyField(to='core_center.school', verbose_name='ecole'),
        ),
        migrations.AddField(
            model_name='professor',
            name='study',
            field=models.ManyToManyField(to='core_center.study', verbose_name='Filière'),
        ),
        migrations.AddField(
            model_name='professor',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='service',
            name='manager',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='service',
            name='posts',
            field=models.ManyToManyField(blank=True, related_name='service_posts', to='core_content.generalpost'),
        ),
        migrations.AddField(
            model_name='service',
            name='school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core_center.school'),
        ),
        migrations.AddField(
            model_name='student',
            name='peer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='students', to='core_author.peer'),
        ),
        migrations.AddField(
            model_name='student',
            name='school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core_center.school'),
        ),
        migrations.AddField(
            model_name='student',
            name='study',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core_center.study'),
        ),
        migrations.AddField(
            model_name='student',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='peer',
            name='manager',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='managed_peer', to='core_author.student'),
        ),
        migrations.AlterUniqueTogether(
            name='peer',
            unique_together={('study', 'year')},
        ),
    ]
