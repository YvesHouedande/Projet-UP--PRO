from faker import Faker
import random
from datetime import datetime
from django.conf import settings
from core.author.models import User, Student, Professor, Personnel, Peer
from core.center.models import School, Study

fake = Faker(['fr_FR'])

def generate_unique_email():
    """Génère un email unique"""
    while True:
        first_name = fake.first_name().lower()
        last_name = fake.last_name().lower()
        random_num = random.randint(1, 9999)
        email = f"{first_name}.{last_name}{random_num}@example.com"
        if not User.objects.filter(email=email).exists():
            return email, first_name, last_name

def generate_user(status_choice='etudiant'):
    """Génère un utilisateur"""
    email, first_name, last_name = generate_unique_email()
    user = User.objects.create(
        email=email,
        username=email,
        first_name=first_name,
        last_name=last_name,
        status_choice=status_choice,
        number=f"6{random.randint(10000000, 99999999)}"
    )
    user.set_password('password123')
    user.save()
    return user

def generate_student(school, study, peer=None, is_manager=False):
    """Génère un étudiant"""
    user = generate_user('etudiant')
    current_year = datetime.now().year
    
    student = Student.objects.create(
        user=user,
        school=school,
        study=study,
        peer=peer,
        bac_year=current_year - random.randint(1, 3),
        level_choices='ts1'  # Par défaut
    )
    return student

def generate_professor(school):
    """Génère un professeur"""
    user = generate_user('professeur')
    professor = Professor.objects.create(
        user=user,
        subject=fake.job()[:50]
    )
    professor.school.add(school)
    return professor

def generate_personnel(school):
    """Génère un personnel administratif"""
    user = generate_user('personnel')
    personnel = Personnel.objects.create(
        user=user,
        job=fake.job()[:50],
        school=school
    )
    return personnel