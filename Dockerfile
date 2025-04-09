FROM node:18

# Créer l’app
WORKDIR /app
COPY . .

# Installer les deps
RUN npm install

# Exposer le port
EXPOSE 3000

# Lancer l’app
CMD ["npm", "start"]
