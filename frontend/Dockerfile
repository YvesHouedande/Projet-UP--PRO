# Étape 1: Construire l'application avec Node.js
FROM node:20-alpine as build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires pour l'installation des dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application (création des fichiers statiques dans /app/build)
RUN npm run build

# Étape 2: Configurer le serveur Nginx pour servir les fichiers construits
FROM nginx:alpine

# Copier le fichier de configuration Nginx personnalisé dans le conteneur
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers construits de l'étape précédente dans le répertoire par défaut de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80 pour le trafic HTTP
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
