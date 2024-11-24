from django.db import models
from core.abstract.models import AbstractModel

class Request(AbstractModel):
    TYPE_CHOICES = (
        ('promotion', 'Création de promotion'),
        ('service', 'Création de service'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'En attente'),
        ('approved', 'Approuvée'),
        ('rejected', 'Rejetée'),
    )

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    name = models.CharField(max_length=255)
    description = models.TextField(help_text="Description et motivation de la demande")
    details = models.JSONField(
        default=dict,
        blank=True,
        help_text="Informations techniques et contacts au format JSON"
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    
    requester = models.ForeignKey('core_author.User', on_delete=models.CASCADE)
    handled_by = models.ForeignKey(
        'core_author.User', 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='handled_requests'
    )
    handled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return f"{self.get_type_display()} - {self.name} ({self.get_status_display()})"