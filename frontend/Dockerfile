# Étape 1 : Construire l'application frontend
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Étape 2 : Configurer Nginx
FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Corrigez cette ligne pour copier le répertoire dist
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 2000

CMD ["nginx", "-g", "daemon off;"]
