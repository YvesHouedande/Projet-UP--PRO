# Documentation Technique - INP-HB Connect

## 🏗️ Architecture Globale

### Backend
- Framework: Django REST Framework
- Base de données: PostgreSQL
- Authentification: JWT (JSON Web Tokens)
- Stockage fichiers: AWS S3

### Frontend  
- Framework: React + Vite
- UI: Tailwind CSS + Flowbite
- State Management: SWR
- Routing: React Router

## 📊 Modèle de Données

### Entités Principales

#### 1. User (Utilisateur)
- Hérite de AbstractBaseUser
- Attributs principaux:
  - email (unique)
  - name
  - status_choice (étudiant/professeur/personnel)
  - from_inp (booléen)
  - inp_mail (email institutionnel)
- Relations:
  - One-to-One avec Student/Professor/Personnel

#### 2. School (École)
- Attributs:
  - label (nom)
  - description
- Relations:
  - One-to-Many avec Study
  - One-to-Many avec Service

#### 3. Study (Filière)
- Attributs:
  - label (nom)
- Relations:
  - Many-to-One avec School
  - One-to-Many avec Peer

#### 4. Peer (Promotion)
- Attributs:
  - label (nom)
  - year (année)
  - manager (délégué)
- Relations:
  - Many-to-One avec Study
  - One-to-Many avec Student
  - Many-to-Many avec GeneralPost

#### 5. Service (Service Administratif)
- Attributs:
  - label (nom)
  - description
  - cover (image)
- Relations:
  - Many-to-One avec School
  - Many-to-Many avec GeneralPost

#### 6. GeneralPost (Publication)
- Attributs:
  - title
  - content
  - content_type (texte/image/rich)
  - source (étudiant/service/promotion)
  - image
- Relations:
  - Many-to-One avec User (author)
  - Many-to-Many avec User (likes)
  - One-to-Many avec Comment

#### 7. Event (Événement)
- Hérite de GeneralPost
- Attributs additionnels:
  - date
  - location
  - participants

#### 8. Request (Demande)
- Attributs:
  - type (promotion/service)
  - status (pending/approved/rejected)
  - details (JSON)
- Relations:
  - Many-to-One avec User (requester)
  - Many-to-One avec User (handled_by)

## 🔄 Flux de Données Principaux

### 1. Authentification
- Login classique (email/password)
- Login Google
- Validation email institutionnel
- Refresh token

### 2. Publications
- Création par utilisateur/service/promotion
- Système de likes
- Commentaires
- Filtrage par source

### 3. Gestion des Promotions
- Système de délégation
- Posts spécifiques
- Gestion des membres

### 4. Événements
- Création par services/promotions
- Gestion des participants
- Notifications

## 🔐 Sécurité

### Permissions
- Basées sur le statut utilisateur
- Vérification email institutionnel
- Protection des routes sensibles

### Validation
- Validation des emails INP-HB
- Vérification des droits de publication
- Contrôle des demandes de création

## 🔧 Configuration Technique

### Variables d'Environnement Requises
- Database URL
- AWS Credentials
- Email Settings
- Google OAuth Keys

### Dépendances Principales
- Django REST Framework
- React
- PostgreSQL
- Redis (cache)

## 📱 API Endpoints

### Authentification
- `/auth/login/`
- `/auth/register/`
- `/auth/google/login/`
- `/auth/validate-email/`

### Publications
- `/general_post/`
- `/peer/{id}/general_post/`
- `/service/{id}/general_post/`

### Utilisateurs
- `/user/`
- `/user/{id}/`
- `/user/{id}/posts/`

### Promotions et Services
- `/peer/`
- `/service/`
- `/school/`
- `/study/`

## 🚀 Déploiement

### Prérequis
- Python 3.8+
- Node.js 14+
- PostgreSQL 12+
- Serveur Linux (recommandé)

### Étapes de Déploiement
1. Configuration base de données
2. Installation dépendances
3. Migrations Django
4. Build frontend
5. Configuration serveur web

## 📈 Monitoring

### Métriques à Surveiller
- Performance API
- Utilisation base de données
- Stockage fichiers
- Erreurs utilisateurs

### Logs
- Accès utilisateurs
- Erreurs système
- Actions administratives

---

Cette documentation est maintenue par l'équipe STIC INP-HB Connect.
Pour toute question: [contact@inpbconnect.com]