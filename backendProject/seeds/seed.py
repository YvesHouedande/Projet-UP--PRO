import os
import django
import random
from datetime import datetime, date

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.center.models import School, Study
from core.author.models import Peer, Student
from .generators import (
    generate_student, 
    generate_professor, 
    generate_personnel,
    generate_peer
)

def create_sample_data():
    print("Création des écoles...")
    # Création des écoles
    schools = []
    school_labels = ['ESI', 'ENSP', 'ENSET', 'FST']
    for label in school_labels:
        school, created = School.objects.get_or_create(
            label=label,
            defaults={'description': f"Description de {label}"}
        )
        schools.append(school)
        if created:
            print(f"École créée : {label}")
        else:
            print(f"École existante : {label}")

    print("\nCréation des filières...")
    # Création des filières
    studies = []
    study_labels = ['STIC', 'GL', 'SIGL', 'RT']
    
    # Associer chaque filière à une école spécifique
    school_study_mapping = {
        'STIC': 'ESI',
        'GL': 'ENSP',
        'SIGL': 'ENSET',
        'RT': 'FST'
    }
    
    for label in study_labels:
        school = School.objects.get(label=school_study_mapping[label])
        study, created = Study.objects.get_or_create(
            label=label,
            defaults={'school': school}
        )
        
        if not created and not study.school:
            study.school = school
            study.save()
            
        studies.append(study)
        if created:
            print(f"Filière créée : {label} (École: {school.label})")
        else:
            print(f"Filière existante : {label} (École: {school.label})")

    print("\nCréation des étudiants et des promotions...")
    for study in studies:
        school = study.school
        for year in range(2021, 2024):
            # Créer d'abord quelques étudiants pour cette filière
            print(f"\nCréation des étudiants pour {study.label} {year}...")
            students_for_peer = []
            for _ in range(5):  # Créer 5 étudiants initialement
                student = generate_student(school, study)
                students_for_peer.append(student)
                print(f"Étudiant créé : {student.user.email}")

            # Choisir un manager parmi ces étudiants
            manager = random.choice(students_for_peer)
            
            # Créer la promotion avec le manager
            peer, created = Peer.objects.get_or_create(
                study=study,
                year=date(year, 1, 1),
                school=study.school,
                defaults={
                    'label': f"Promotion {study.label} {year}",
                    'description': f"Promotion {study.label} de l'année {year}",
                    'manager': manager  # Assigner le manager
                }
            )

            if created:
                print(f"Promotion créée : {peer.label} (Manager: {manager.user.email})")
            else:
                print(f"Promotion existante : {peer.label}")

            # Assigner tous les étudiants à cette promotion
            for student in students_for_peer:
                student.peer = peer
                student.save()

            # Ajouter plus d'étudiants si nécessaire
            existing_students = peer.students.count()
            for i in range(max(0, 15 - existing_students)):
                student = generate_student(school, study)
                student.peer = peer
                student.save()
                print(f"Étudiant supplémentaire créé : {student.user.email}")

    print("\nCréation des professeurs et du personnel...")
    for school in schools:
        print(f"\nPour l'école {school.label}:")
        
        # Génération de professeurs
        print("Création des professeurs...")
        existing_professors = school.professor_set.count()
        for i in range(max(0, 5 - existing_professors)):
            professor = generate_professor(school)
            print(f"Professeur créé : {professor.user.email}")

        # Génération de personnel
        print("\nCréation du personnel...")
        existing_personnel = school.personnel_set.count()
        for i in range(max(0, 3 - existing_personnel)):
            personnel = generate_personnel(school)
            print(f"Personnel créé : {personnel.user.email}")

if __name__ == '__main__':
    print("Début de la génération des données...")
    create_sample_data()
    print("\nGénération des données terminée!")