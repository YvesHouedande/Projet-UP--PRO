# Generated by Django 5.0.6 on 2024-09-09 15:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_author', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='validation_code',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]
