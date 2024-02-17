# Generated by Django 5.0.2 on 2024-02-17 11:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_author', '0001_initial'),
        ('core_center', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='level_choices',
            field=models.CharField(choices=[('ts', 'TS'), ('eng', 'eng')], max_length=5, null=True),
        ),
        migrations.AlterField(
            model_name='student',
            name='study',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='students', to='core_center.study'),
        ),
    ]
