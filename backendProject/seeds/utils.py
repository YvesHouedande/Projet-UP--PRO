from faker import Faker
import random
from datetime import date

fake = Faker(['fr_FR'])

def format_phone_number(phone):
    """Formate le numéro de téléphone"""
    numbers_only = ''.join(filter(str.isdigit, phone))
    return numbers_only[:10]

def generate_bac_year():
    """Génère une année de bac cohérente"""
    return date(random.randint(2020, 2023), 7, 1)

def generate_level_choice(year):
    """Génère un niveau cohérent avec l'année"""
    current_year = date.today().year
    years_since_bac = current_year - year
    
    if years_since_bac <= 1:
        return 'ts1'
    elif years_since_bac == 2:
        return 'ts2'
    else:
        return 'ts3' 