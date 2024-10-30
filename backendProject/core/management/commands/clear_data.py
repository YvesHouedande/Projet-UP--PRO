from django.core.management.base import BaseCommand
from django.db import connection
from core.author.models import User, Student, Professor, Personnel, Peer
from core.center.models import School, Study

class Command(BaseCommand):
    help = 'Vide toutes les données de la base de données'

    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            help='Supprime toutes les données'
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force la suppression en désactivant temporairement les contraintes'
        )

    def handle(self, *args, **options):
        try:
            if options['all']:
                if options['force']:
                    self._clear_all_force()
                else:
                    self._clear_all()
            else:
                self.stdout.write('Spécifiez --all pour supprimer toutes les données')
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erreur: {str(e)}'))

    def _clear_all_force(self):
        """Supprime toutes les données en désactivant temporairement les contraintes"""
        self.stdout.write('Suppression forcée des données...')
        
        with connection.cursor() as cursor:
            # Désactive temporairement les contraintes
            cursor.execute('SET CONSTRAINTS ALL DEFERRED;')
            
            # Supprime les données dans l'ordre
            self.stdout.write('Suppression des étudiants...')
            Student.objects.all().delete()
            
            self.stdout.write('Suppression des professeurs...')
            Professor.objects.all().delete()
            
            self.stdout.write('Suppression du personnel...')
            Personnel.objects.all().delete()
            
            self.stdout.write('Suppression des promotions...')
            Peer.objects.all().delete()
            
            self.stdout.write('Suppression des utilisateurs...')
            User.objects.all().delete()
            
            self.stdout.write('Suppression des filières...')
            Study.objects.all().delete()
            
            self.stdout.write('Suppression des écoles...')
            School.objects.all().delete()
            
            # Réactive les contraintes
            cursor.execute('SET CONSTRAINTS ALL IMMEDIATE;')
        
        self.stdout.write(self.style.SUCCESS('Toutes les données ont été supprimées avec succès!'))

    def _clear_all(self):
        """Supprime toutes les données dans l'ordre normal"""
        self.stdout.write('Suppression des données...')
        
        # Supprime d'abord les promotions et les étudiants ensemble
        self.stdout.write('Suppression des promotions et étudiants...')
        with connection.cursor() as cursor:
            cursor.execute('TRUNCATE TABLE core_author_peer, core_author_student CASCADE;')
        
        self.stdout.write('Suppression des professeurs...')
        Professor.objects.all().delete()
        
        self.stdout.write('Suppression du personnel...')
        Personnel.objects.all().delete()
        
        self.stdout.write('Suppression des utilisateurs...')
        User.objects.all().delete()
        
        self.stdout.write('Suppression des filières...')
        Study.objects.all().delete()
        
        self.stdout.write('Suppression des écoles...')
        School.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Toutes les données ont été supprimées avec succès!'))