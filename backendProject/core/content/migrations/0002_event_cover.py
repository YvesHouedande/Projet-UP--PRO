# Generated by Django 5.0.6 on 2024-09-12 21:07

import core.utils
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_content', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='cover',
            field=models.ImageField(blank=True, null=True, upload_to=core.utils.get_upload_path, verbose_name='Image'),
        ),
    ]
