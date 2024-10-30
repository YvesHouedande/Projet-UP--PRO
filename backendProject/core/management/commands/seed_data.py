from django.core.management.base import BaseCommand
from datetime import date
from seeds.config import SEED_CONFIG
from seeds.generators import (
    generate_student, 
    generate_professor, 
    generate_personnel
)
from core.author.models import Peer
from core.center.models import School, Study

class Command(BaseCommand):
    help = 'Remplit la base de données avec des données de test'

    def add_arguments(self, parser):
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
            help='Génère uniquement les promotions'
        )
        parser.add_argument(
            '--students',
            action='store_true',
            help='Génère uniquement les étudiants'
        )
        parser.add_argument(
            '--staff',
            action='store_true',
            help='Génère uniquement le personnel'
        )
        parser.add_argument(
            '--all',
            action='store_true',
            help='Génère toutes les données'
        )

    def handle(self, *args, **options):
        try:
            if options['all'] or options['schools']:
                self._create_schools()
            
            if options['all'] or options['studies']:
                self._create_studies()
            
            if options['all'] or options['promotions']:
                self._create_promotions()
            
            if options['all'] or options['students']:
                self._create_students()
            
            if options['all'] or options['staff']:
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

    def _create_promotions(self):
        self.stdout.write('Création des promotions...')
        for study in Study.objects.all():
            for year in SEED_CONFIG['PROMOTIONS']['YEARS']:
                Peer.objects.get_or_create(
                    study=study,
                    year=date(year, 1, 1),
                    school=study.school,
                    defaults={
                        'label': f"Promotion {study.label} {year}",
                        'description': f"Promotion {study.label} de l'année {year}"
                    }
                )

    def _create_students(self):
        self.stdout.write('Création des étudiants...')
        for peer in Peer.objects.all():
            # Créer d'abord le délégué
            manager = generate_student(peer.school, peer.study, peer)
            
            # Mettre à jour la promotion avec le délégué
            peer.manager = manager
            peer.save()
            
            # Créer les autres étudiants
            for _ in range(SEED_CONFIG['PROMOTIONS']['STUDENTS_PER_PROMOTION'] - 1):
                generate_student(peer.school, peer.study, peer)

    def _create_staff(self):
        self.stdout.write('Création du personnel...')
        for school in School.objects.all():
            for _ in range(SEED_CONFIG['STAFF']['PROFESSORS_PER_SCHOOL']):
                generate_professor(school)
            
            for _ in range(SEED_CONFIG['STAFF']['PERSONNEL_PER_SCHOOL']):
                generate_personnel(school) 