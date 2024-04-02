from django.db import models

# Create your models here.
class School(models.Model):
    label = models.CharField(max_length=255, verbose_name="Nom:")
    class Meta:
        verbose_name = "Ecole"

    def __str__(self):
        return f"{self.label}"

class Study(models.Model):
    label = models.CharField(max_length=255, verbose_name="Nom:")
    school = models.ForeignKey(to="School", on_delete=models.CASCADE, verbose_name="Auteur", null=True, blank=True)
    class Meta:
        verbose_name="Filière"
    def __str__(self):
        return f"{self.label}"




