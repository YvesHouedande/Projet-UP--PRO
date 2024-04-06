from django.db import models
from core.abstract.models import AbstractModel

# Create your models here.
class School(AbstractModel):
    label = models.CharField(max_length=255, unique=True, verbose_name="Nom:")
    description = models.TextField(null=True, blank=True)
    class Meta:
        verbose_name = "Ecole"

    def __str__(self):
        return f"{self.label}"

class Study(AbstractModel):
    label = models.CharField(max_length=255, verbose_name="Nom:", unique=True)
    school = models.ForeignKey(to="School", on_delete=models.CASCADE, verbose_name="Ecole", null=True, blank=True)
    class Meta:
        verbose_name="Filière"
    def __str__(self):
        return f"{self.label}"




