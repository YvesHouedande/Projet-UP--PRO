from django.db import models

# Create your models here.


class School(models.Model):
    label = models.CharField(max_length=255)

class Study(models.Model):
    label = models.CharField(max_length=255)




