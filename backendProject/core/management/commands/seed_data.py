from django.core.management.base import BaseCommand
from seeds.config import SEED_CONFIG
from seeds.generators import (
    generate_student, 
    generate_professor, 
    generate_personnel
)
from core.author.models import Peer, Student
from core.center.models import School, Study

class Command(BaseCommand):
    help = 'Remplit la base de données avec des données de test'

    def handle(self, *args, **options):
        try:
            self._create_schools()
            self._create_studies()
            self._create_promotions_and_students()
            self._create_staff()
            self.stdout.write(self.style.SUCCESS('Génération des données terminée!'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erreur: {str(e)}'))

    def _create_schools(self):
        self.stdout.write('Création des écoles...')
        for school_data in SEED_CONFIG['SCHOOLS']:
            School.objects.get_or_create(
                label=school_data['label'],
                defaults={'description': school_data['description']}
            )

    def _create_studies(self):
        self.stdout.write('Création des filières...')
        for study_data in SEED_CONFIG['STUDIES']:
            school = School.objects.get(label=study_data['school'])
            Study.objects.get_or_create(
                label=study_data['label'],
                defaults={'school': school}
            )

    def _create_promotions_and_students(self):
        self.stdout.write('Création des promotions et des étudiants...')
        
        for study in Study.objects.all():
            self.stdout.write(f"\nCréation des promotions pour {study.label}...")
            
            for year in SEED_CONFIG['PROMOTIONS']['YEARS']:
                try:
                    # Créer d'abord un étudiant qui sera le délégué
                    manager = generate_student(
                        school=study.school,
                        study=study
                    )
                    
                    # Créer la promotion
                    peer = Peer.objects.create(
                        study=study,
                        year=year,
                        school=study.school,
                        label=f"{study.label}{str(year)[-2:]}",
                        manager=manager
                    )
                    
                    # Mettre à jour le délégué
                    manager.peer = peer
                    manager.save()
                    
                    # Créer les autres étudiants
                    for _ in range(SEED_CONFIG['PROMOTIONS']['STUDENTS_PER_PROMOTION'] - 1):
                        student = generate_student(
                            school=study.school,
                            study=study,
                            peer=peer
                        )
                        
                except Exception as e:
                    self.stdout.write(self.style.ERROR(
                        f"Erreur lors de la création de la promotion {study.label}{year}: {str(e)}"
                    ))
                    continue

    def _create_staff(self):
        self.stdout.write('Création du personnel...')
        for school in School.objects.all():
            for _ in range(SEED_CONFIG['STAFF']['PROFESSORS_PER_SCHOOL']):
                generate_professor(school)
            
            for _ in range(SEED_CONFIG['STAFF']['PERSONNEL_PER_SCHOOL']):
                generate_personnel(school) 