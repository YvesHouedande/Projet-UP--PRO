from faker import Faker
import random
from datetime import datetime, date
from django.conf import settings
from core.author.models import User, Student, Professor, Personnel, Peer
from core.center.models import School, Study

fake = Faker(['fr_FR'])

def format_phone_number(phone):
    """Formate le numéro de téléphone"""
    numbers_only = ''.join(filter(str.isdigit, phone))
    return numbers_only[:10]

def generate_bac_year():
    """Génère une année de bac cohérente"""
    current_year = datetime.now().year
    return random.randint(current_year - 5, current_year)

def generate_level_choice(year):
    """Détermine le niveau en fonction de l'année"""
    current_year = datetime.now().year
    years_diff = current_year - year
    
    if years_diff <= 1:
        return 'ts1'
    elif years_diff == 2:
        return 'ts2'
    else:
        return 'ts3'

def generate_user(status_choice='etudiant'):
    """Génère un utilisateur"""
    first_name = fake.first_name()
    last_name = fake.last_name()
    email = f"{first_name.lower()}.{last_name.lower()}@example.com"
    
    user = User.objects.create(
        email=email,
        first_name=first_name,
        last_name=last_name,
        status_choice=status_choice,
        number=format_phone_number(fake.phone_number()),
        username=email
    )
    user.set_password('password123')
    user.save()
    
    return user

def generate_student(school, study, peer, is_manager=False):
    """Génère un étudiant"""
    user = generate_user('etudiant')
    
    # Si peer existe, utilise son année, sinon utilise l'année courante
    year_reference = peer.year.year if peer else datetime.now().year
    
    student = Student.objects.create(
        user=user,
        school=school,
        study=study,
        peer=peer,
        bac_year=year_reference - random.randint(1, 3),  # 1-3 ans avant l'année de référence
        level_choices=generate_level_choice(year_reference)
    )
    
    return student

def generate_professor(school):
    """Génère un professeur"""
    user = generate_user('professeur')
    
    professor = Professor.objects.create(
        user=user,
        school=school,
        speciality=fake.job()[:50]
    )
    
    return professor

def generate_personnel(school):
    """Génère un personnel administratif"""
    user = generate_user('personnel')
    
    personnel = Personnel.objects.create(
        user=user,
        school=school,
        position=fake.job()[:50]
    )
    
    return personnel