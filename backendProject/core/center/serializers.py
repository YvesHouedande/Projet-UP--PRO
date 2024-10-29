from core.abstract.serializers import AbstractSerializer
from .models import School, Study
from rest_framework import serializers

class SchoolSerializer(AbstractSerializer):
    class Meta:
        model = School
        fields = "__all__"  
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["filter"] = {
            "filière": [
                {study.label:f"/api/study/{study.public_id}"} for study in instance.study_set.all()
                ],
            "utilisateurs": [
                {
                "Etudiants":f"/api/school/{instance.public_id}/student",
                "professeurs":f"/api/school/{instance.public_id}/professor",
                "personnel": f"/api/school/{instance.public_id}/personnel",
                },
                ],
            "services": [
                {service.label:f"/api/service/{service.public_id}/"} for service in instance.service_set.all()
                ],
            "promos":  [
                {peer.label:f"/api/peer/{peer.public_id}/"} for peer in instance.peer_set.all()
                ]
        }
        return rep


class StudySerializer(AbstractSerializer):
    school = serializers.SlugRelatedField(
    queryset=School.objects.all(), slug_field="public_id"
    )
    class Meta:
        model = Study
        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["filter"] = {
            "utilisateurs": [
                {
                "Etudiants":f"/api/study/{instance.public_id}/student"
                },
                {
                "professeurs":f"/api/study/{instance.public_id}/professor"
                },
                {
                "personnel":f"/api/study/{instance.public_id}/personnel"
                }
                  ],
            "promos": [
                {peer.label:f"/api/peer/{peer.public_id}/"} for peer in instance.peer_set.all().order_by("-created")
                ]
        }
        return rep
    

