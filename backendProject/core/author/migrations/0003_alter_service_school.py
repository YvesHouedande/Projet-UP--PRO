# Generated by Django 5.0.6 on 2024-12-01 18:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_author', '0002_initial'),
        ('core_center', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='service',
            name='school',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core_center.school'),
        ),
    ]
