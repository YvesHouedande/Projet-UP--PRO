# Generated by Django 5.0.2 on 2024-03-03 16:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_author', '0007_alter_student_level_choices_alter_user_status_choice'),
        ('core_content', '0003_alter_comment_options_alter_postuser_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='postpeer',
            options={'verbose_name': 'PostPromo'},
        ),
        migrations.AlterModelOptions(
            name='postservice',
            options={'verbose_name': 'PostService'},
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('moment', models.DateTimeField()),
                ('place', models.CharField(blank=True, max_length=255, null=True)),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core_author.service')),
            ],
        ),
    ]
