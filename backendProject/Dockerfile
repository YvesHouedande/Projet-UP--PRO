# Étape 1: Construire l'application Python/Django
FROM python:3.11-slim AS build

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances pour psycopg2 et autres dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copier le fichier requirements.txt et installer les dépendances Python
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copier tous les fichiers du projet dans l'image
COPY . .

# Étape 2: Configurer le serveur Nginx et Gunicorn
FROM nginx:alpine AS final

# Installer Python et pip dans l'image Nginx
RUN apk add --no-cache python3 py3-pip

# Créer un environnement virtuel pour installer Gunicorn et Django
RUN python3 -m venv /opt/venv

# Activer l'environnement virtuel et installer les dépendances (y compris Django et Gunicorn)
COPY --from=build /app/requirements.txt /opt/venv/requirements.txt
RUN /opt/venv/bin/pip install --upgrade pip \
    && /opt/venv/bin/pip install --no-cache-dir -r /opt/venv/requirements.txt

# Copier les fichiers statiques de Django dans le conteneur 
COPY --from=build /app/static /usr/share/nginx/html/static

# Copier le fichier de configuration Nginx dans le conteneur
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le projet (y compris wsgi.py) depuis l'étape de construction
COPY --from=build /app /app

# Définir le répertoire de travail final
WORKDIR /app

# Exposer les ports nécessaires pour Gunicorn et Nginx
EXPOSE 80

# Commande de démarrage de Gunicorn et Nginx
CMD ["sh", "-c", "/opt/venv/bin/gunicorn --bind 0.0.0.0:8000 backend.wsgi:application & nginx -g 'daemon off;'"]










