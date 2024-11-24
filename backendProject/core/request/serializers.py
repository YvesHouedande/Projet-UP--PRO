from rest_framework import serializers
from core.abstract.serializers import AbstractSerializer
from core.request.models import Request
from core.author.serializers import UserSerializer

class RequestSerializer(AbstractSerializer):
    requester = UserSerializer(read_only=True)
    handled_by = UserSerializer(read_only=True)

    class Meta:
        model = Request
        fields = [
            'public_id',
            'type',
            'name',
            'description',
            'details',
            'status',
            'requester',
            'handled_by',
            'handled_at',
            'created',
            'updated'
        ]
        read_only_fields = ['status', 'handled_by', 'handled_at']

    def validate_details(self, value):
        """
        Validation des détails avec vérification des contacts obligatoires
        """
        if not isinstance(value, dict):
            raise serializers.ValidationError("Les détails doivent être un objet JSON valide")

        # Vérification des informations de contact
        contact_info = value.get('contact_info', {})
        if not contact_info.get('email'):
            raise serializers.ValidationError("L'email de contact est obligatoire")
        if not contact_info.get('phone'):
            raise serializers.ValidationError("Le numéro de téléphone est obligatoire")

        return value

    def create(self, validated_data):
        requester = self.context['request'].user
        return Request.objects.create(requester=requester, **validated_data)
