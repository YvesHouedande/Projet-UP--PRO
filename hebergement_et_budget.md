# Guide d'Hébergement et Budget - INP-HB Connect

## 🌐 Stratégie d'Hébergement

### 1. Nom de Domaine
- **Recommandation** : `.ci` (Côte d'Ivoire) ou `.com`
- **Options** :
  - `inphbconnect.ci`
  - `inphbconnect.com`
- **Fournisseurs** :
  - web.ci (pour .ci) : ~30,000 FCFA/an
  - Namecheap (pour .com) : ~7,000 FCFA/an

### 2. Hébergement Backend

#### Option 1: VPS (Recommandée pour démarrer)
**DigitalOcean**
- Plan Basic : 4GB RAM, 2 vCPUs, 80GB SSD
- Parfait pour 5000 utilisateurs actifs
- Prix : ~32,000 FCFA/mois

#### Option 2: Services Cloud
**AWS Elastic Beanstalk**
- Plus scalable mais plus complexe
- Meilleur pour la phase de croissance
- Prix estimé : ~50,000 FCFA/mois

### 3. Base de Données

#### Option 1: Base de données managée
**DigitalOcean Managed Database**
- PostgreSQL
- 1GB RAM, 10GB stockage
- Prix : ~25,000 FCFA/mois

#### Option 2: Sur le même VPS
- Gratuit mais moins sécurisé
- Recommandé uniquement pour les tests

### 4. Stockage Fichiers

**AWS S3 ou DigitalOcean Spaces**
- Pour les images et fichiers
- 250GB stockage
- Prix : ~15,000 FCFA/mois

### 5. CDN (Content Delivery Network)
**Cloudflare**
- Plan gratuit suffisant pour démarrer
- Sécurité et performance améliorées

## 💰 Budget Estimatif

### Première Année

#### Coûts Fixes
1. **Nom de domaine**
   - .ci : 30,000 FCFA/an

2. **Certificat SSL**
   - Gratuit avec Let's Encrypt

3. **Hébergement (VPS)**
   - DigitalOcean : 384,000 FCFA/an
   - (32,000 FCFA × 12 mois)

4. **Base de données**
   - 300,000 FCFA/an
   - (25,000 FCFA × 12 mois)

5. **Stockage**
   - 180,000 FCFA/an
   - (15,000 FCFA × 12 mois)

6. **Services Email**
   - SendGrid : 60,000 FCFA/an
   - (5,000 FCFA × 12 mois)

#### Coûts Variables
1. **Bande passante**
   - Incluse dans le VPS jusqu'à 4TB/mois

2. **Support technique**
   - 300,000 FCFA/an
   - (maintenance et mises à jour)

#### Total Première Année
- **1,254,000 FCFA**
- (~250 FCFA par étudiant/an)

### Deuxième Année

#### Augmentation Prévue
1. **Upgrade VPS**
   - 8GB RAM, 4 vCPUs
   - 576,000 FCFA/an
   - (48,000 FCFA × 12 mois)

2. **Base de données améliorée**
   - 420,000 FCFA/an
   - (35,000 FCFA × 12 mois)

3. **Stockage augmenté**
   - 240,000 FCFA/an
   - (20,000 FCFA × 12 mois)

#### Total Deuxième Année
- **1,626,000 FCFA**
- (~325 FCFA par étudiant/an)

## 🛠️ Processus de Déploiement

### 1. Préparation
1. Achat du nom de domaine
2. Configuration DNS chez Cloudflare
3. Création du VPS chez DigitalOcean
4. Configuration base de données

### 2. Configuration Serveur
1. Installation Ubuntu Server 22.04 LTS
2. Configuration Nginx
3. Installation Python, Node.js
4. Configuration SSL (Certbot)

### 3. Déploiement Application
1. Configuration Gunicorn pour Django
2. Build React et déploiement statique
3. Configuration supervisord
4. Tests de charge

### 4. Monitoring
1. Configuration DigitalOcean Monitoring
2. Mise en place Sentry pour les erreurs
3. Configuration des sauvegardes automatiques

## 📈 Plan de Scaling

### Première Année
- VPS unique avec toutes les composantes
- Cloudflare gratuit
- Sauvegardes quotidiennes

### Deuxième Année
- Séparation base de données
- Augmentation ressources VPS
- CDN payant si nécessaire
- Monitoring avancé

## ⚠️ Points d'Attention

1. **Sécurité**
   - Sauvegardes régulières
   - Mises à jour de sécurité
   - Protection DDoS via Cloudflare

2. **Performance**
   - Monitoring charge serveur
   - Optimisation requêtes DB
   - Cache Redis

3. **Maintenance**
   - Mises à jour mensuelles
   - Tests de restauration
   - Documentation des procédures

## 🆘 Support et Maintenance

### Support Niveau 1
- Équipe interne STIC
- Temps de réponse : 24h
- Problèmes basiques

### Support Niveau 2
- Développeurs seniors
- Temps de réponse : 48h
- Problèmes complexes

---

*Note: Ces estimations sont basées sur les prix actuels (2024) et peuvent varier selon l'utilisation réelle et l'évolution des tarifs des fournisseurs.* 