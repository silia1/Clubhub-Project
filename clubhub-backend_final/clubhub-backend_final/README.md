# 🛠️ Clubhub – Backend (NestJS)

Ce dossier contient le **backend de l’application Clubhub**, développé avec le framework **NestJS**.  
Il fournit une **API REST sécurisée** utilisée par le frontend pour gérer les utilisateurs, les inscriptions, les activités, les devis, les fichiers (CV, images de profil), etc.

---

## Stack technique

- NestJS (Node.js & TypeScript)
- MongoDB avec Mongoose
- Multer (upload de fichiers)
- JWT (authentification sécurisée)
- REST API
- CORS, validation, pipes, guards

---

##  Installation

Assurez-vous d’avoir **Node.js** et une **base de données MongoDB** (locale ou sur Atlas) fonctionnelle.

```bash
# Aller dans le dossier backend
cd clubhub-backend_final/clubhub-backend_final

# Installer les dépendances
npm install

#Lancer le serveur en développement
npm run start:dev
