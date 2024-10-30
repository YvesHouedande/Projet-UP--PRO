SEED_CONFIG = {
    'SCHOOLS': [
        {'label': 'ESI', 'description': 'École Supérieure d\'Informatique'},
        {'label': 'ENSP', 'description': 'École Nationale Supérieure Polytechnique'},
        {'label': 'ENSET', 'description': 'École Normale Supérieure d\'Enseignement Technique'},
        {'label': 'FST', 'description': 'Faculté des Sciences et Techniques'}
    ],
    'STUDIES': [
        {'label': 'STIC', 'school': 'ESI'},
        {'label': 'GL', 'school': 'ENSP'},
        {'label': 'SIGL', 'school': 'ENSET'},
        {'label': 'RT', 'school': 'FST'}
    ],
    'PROMOTIONS': {
        'YEARS': [2021, 2022, 2023],
        'STUDENTS_PER_PROMOTION': 15
    },
    'STAFF': {
        'PROFESSORS_PER_SCHOOL': 5,
        'PERSONNEL_PER_SCHOOL': 3
    }
} 