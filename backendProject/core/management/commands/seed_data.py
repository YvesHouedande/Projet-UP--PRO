from django.core.management.base import BaseCommand
from datetime import date
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

    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            help='Génère toutes les données'
        )
        parser.add_argument(
            '--schools',
            action='store_true',
            help='Génère uniquement les écoles'
        )
        parser.add_argument(
            '--studies',
            action='store_true',
            help='Génère uniquement les filières'
        )
        parser.add_argument(
            '--promotions',
            action='store_true',
            help='Génère uniquement les promotions et leurs étudiants'
        )
        parser.add_argument(
            '--staff',
            action='store_true',
            help='Génère uniquement le personnel'
        )

    def handle(self, *args, **options):
        try:
            if options['all']:
                self._create_schools()
                self._create_studies()
                self._create_promotions_and_students()
                self._create_staff()
            else:
                if options['schools']:
                    self._create_schools()
                if options['studies']:
                    self._create_studies()
                if options['promotions']:
                    self._create_promotions_and_students()
                if options['staff']:
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
        
        # Supprimer d'abord toutes les promotions existantes
        self.stdout.write('Suppression des anciennes promotions...')
        Peer.objects.all().delete()
        
        # Supprimer tous les étudiants existants
        self.stdout.write('Suppression des anciens étudiants...')
        Student.objects.all().delete()
        
        for study in Study.objects.all():
            self.stdout.write(f"\nCréation des promotions pour {study.label}...")
            
            for year in SEED_CONFIG['PROMOTIONS']['YEARS']:
                # Générer un label unique pour la promotion
                promotion_label = f"{study.label}{str(year)[-2:]}"
                
                try:
                    # Créer d'abord un étudiant qui sera le délégué
                    manager = generate_student(
                        school=study.school,
                        study=study,
                        peer=None,
                        is_manager=True
                    )
                    
                    # Créer la promotion avec le délégué
                    peer = Peer.objects.create(
                        study=study,
                        year=date(year, 1, 1),
                        school=study.school,
                        label=promotion_label,
                        description=f"Promotion {study.label} de l'année {year}",
                        manager=manager
                    )
                    
                    # Mettre à jour le délégué avec sa promotion
                    manager.peer = peer
                    manager.save()
                    
                    self.stdout.write(self.style.SUCCESS(
                        f"Promotion créée : {peer.label} (Manager: {manager.user.email})"
                    ))
                    
                    # Créer les autres étudiants de la promotion
                    for _ in range(SEED_CONFIG['PROMOTIONS']['STUDENTS_PER_PROMOTION'] - 1):
                        student = generate_student(
                            school=study.school,
                            study=study,
                            peer=peer
                        )
                        self.stdout.write(f"Étudiant créé : {student.user.email}")
                        
                except Exception as e:
                    self.stdout.write(self.style.ERROR(
                        f"Erreur lors de la création de la promotion {promotion_label}: {str(e)}"
                    ))
                    # Si une erreur survient, on nettoie les données partiellement créées
                    if 'manager' in locals():
                        manager.delete()
                    continue

    def _create_staff(self):
        self.stdout.write('Création du personnel...')
        for school in School.objects.all():
            # Professeurs
            for _ in range(SEED_CONFIG['STAFF']['PROFESSORS_PER_SCHOOL']):
                professor = generate_professor(school)
                self.stdout.write(f"Professeur créé : {professor.user.email}")
            
            # Personnel administratif
            for _ in range(SEED_CONFIG['STAFF']['PERSONNEL_PER_SCHOOL']):
                personnel = generate_personnel(school)
                self.stdout.write(f"Personnel créé : {personnel.user.email}") 