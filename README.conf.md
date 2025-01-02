# Documentation du Projet Dockerisé

## Introduction

Ce projet utilise **Docker** et **Docker Compose** pour faciliter la gestion des environnements de développement et de production. Il est configuré pour exécuter une application avec un backend en Python/Django, un frontend en React et une base de données PostgreSQL. Cette documentation explique la configuration, l'utilisation et les bonnes pratiques pour le déploiement en local (développement) et en production.

## Structure du Projet

/
├── backendProject/       # Code source du backend
├── frontend/             # Code source du frontend
├── .env                  # Variables d'environnement
├── docker-compose.yml    # Configuration de base (production)
├── docker-compose.override.yml   # Configuration spécifique au développement
├── Dockerfile.dev        # Dockerfile pour l'environnement de développement
├── Dockerfile.prod       # Dockerfile pour l'environnement de production


## Environnements de Développement et de Production

Le projet utilise **Docker Compose** pour gérer les services dans des environnements de développement et de production. Selon l'environnement, des configurations spécifiques sont appliquées.

###  Fichier `.env`

Le fichier `.env` contient des variables d'environnement essentielles pour la configuration des services (backend, frontend, base de données). Il est possible de basculer entre les environnements de développement et de production en modifiant les variables dans ce fichier.

```env
# Pour l'environnement de développement
ENV=development
NODE_ENV=development
DOCKERFILE=Dockerfile.dev

# Pour l'environnement de production (décommentez pour passer en production)
# ENV=production
# NODE_ENV=production
# DOCKERFILE=Dockerfile.prod

# Variables de la base de données
DATABASE_USER=myuser
DATABASE_PASSWORD=mypassword
DATABASE_NAME=mydatabase
DATABASE_HOST=db
DATABASE_PORT=5432
FRONTEND_PORT=80

ENV_PATH= /opt/venv


## **Lancer les Services**
1. Environnement de Développement
  Pour démarrer les services en mode développement, utilisez la commande suivante :

  bash
    docker-compose --env-file .env up --build

  Cette commande va :

    Construire les images des services frontend et backend.
    Lancer les services avec les configurations définies pour le développement.
    Monter les volumes locaux pour le code source et les node_modules afin de faciliter le développement en temps réel.

2. Environnement de Production
  Pour démarrer les services en mode production, modifiez le fichier .env pour activer la configuration de production (décommentez les lignes de production). Ensuite, utilisez la commande suivante :

  bash
    docker-compose --env-file .env up --build

  Cette commande démarre les services avec les configurations adaptées à un environnement de production, sans les volumes de développement.

## **Arrêter les Services**
  Pour arrêter et supprimer les conteneurs et volumes associés, utilisez la commande suivante :

  bash
    docker-compose down --volumes

