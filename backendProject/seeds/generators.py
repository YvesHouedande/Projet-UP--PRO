from datetime import date
from .utils import fake, format_phone_number, generate_bac_year, generate_level_choice
from core.author.models import User, Student, Professor, Personnel, Peer
from core.center.models import School, Study

def generate_user(status_choice='etudiant', **kwargs):
    """Génère un utilisateur"""
    first_name = kwargs.get('first_name', fake.first_name())
    last_name = kwargs.get('last_name', fake.last_name())
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

def generate_student(school, study, peer, **kwargs):
    """Génère un étudiant pour une promotion spécifique"""
    user = generate_user('etudiant', **kwargs)
    
    # Détermine le niveau en fonction de l'année de la promotion
    level = generate_level_choice(peer.year.year)
    
    student = Student.objects.create(
        user=user,
        school=school,
        study=study,
        peer=peer,
        bac_year=generate_bac_year(),
        level_choices=level
    )
    
    return student

def generate_professor(school):
    """Génère un professeur"""
    user = generate_user('professeur')
    return Professor.objects.create(
        user=user,
        school=school,
        speciality=fake.job()[:50]
    )

def generate_personnel(school):
    """Génère un personnel administratif"""
    user = generate_user('personnel')
    return Personnel.objects.create(
        user=user,
        school=school,
        position=fake.job()[:50]
    )