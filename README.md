# 📧 mail-manager-api

API REST de gestion des emails pour **Tutorat Tech** — Node.js / Express / Sequelize / Nodemailer.

---

## 🚀 Installation

```bash
npm install
cp .env .env.local   # Remplis tes vraies valeurs
npm run dev          # Développement
npm start            # Production
```

---

## ⚙️ Variables d'environnement (.env)

| Variable | Description |
|---|---|
| `PORT` | Port du serveur (défaut 4000) |
| `JWT_SECRET` | Clé secrète JWT (longue et aléatoire) |
| `SMTP_HOST` | Hôte SMTP (ex: smtp.gmail.com) |
| `SMTP_PORT` | Port SMTP (587 pour TLS) |
| `SMTP_USER` | Email expéditeur |
| `SMTP_PASS` | Mot de passe d'application SMTP |
| `ADMIN_EMAIL` | Email admin qui reçoit les notifications |
| `ADMIN_EMAIL_DEFAULT` | Email du premier compte admin |
| `ADMIN_PASSWORD_DEFAULT` | Mot de passe du premier compte admin |
| `ALLOWED_ORIGINS` | Origines CORS autorisées (séparées par virgule) |

---

## 📌 Endpoints

### 🔐 Auth
| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Non | Connexion admin |
| POST | `/api/auth/logout` | Non | Déconnexion |
| GET | `/api/auth/me` | ✅ Admin | Infos admin connecté |

### 📬 Contact
| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/contact/send` | Non | Envoyer un message |
| GET | `/api/contact/messages` | ✅ Admin | Liste les messages |
| PATCH | `/api/contact/messages/:id/status` | ✅ Admin | Changer le statut |
| DELETE | `/api/contact/messages/:id` | ✅ Admin | Supprimer un message |

### 💼 Devis
| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/devis/send` | Non | Soumettre une demande |
| GET | `/api/devis/list` | ✅ Admin | Liste les demandes |
| PATCH | `/api/devis/:id/status` | ✅ Admin | Changer le statut |
| DELETE | `/api/devis/:id` | ✅ Admin | Supprimer une demande |

### 📰 Newsletter
| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/newsletter/subscribe` | Non | S'abonner |
| GET | `/api/newsletter/unsubscribe?token=xxx` | Non | Se désabonner (lien email) |
| GET | `/api/newsletter/subscribers` | ✅ Admin | Liste les abonnés |
| POST | `/api/newsletter/broadcast` | ✅ Admin | Envoyer à tous |
| DELETE | `/api/newsletter/subscribers/:id` | ✅ Admin | Supprimer un abonné |

### 📊 Dashboard
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard/stats` | ✅ Admin | Stats globales |

---

## 📦 Format de réponse uniforme

```json
{
  "responseCode": "200",
  "responseMessage": "Opération réussie.",
  "data": []
}
```

---

## 🔒 Rate Limiting

| Route | Limite |
|---|---|
| Contact `/send` | 5 requêtes / 15 min par IP |
| Devis `/send` | 3 requêtes / heure par IP |
| Newsletter `/subscribe` | 3 requêtes / heure par IP |
| Auth `/login` | 10 tentatives / 15 min par IP |
| Global | 100 requêtes / minute par IP |

---

## 📋 Exemples de requêtes

### Envoyer un message de contact
```bash
curl -X POST http://localhost:4000/api/contact/send \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "phone": "+228 90 00 00 00",
    "message": "Bonjour, j'\''aimerais un devis pour mon site."
  }'
```

### Login admin
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{ "email": "admin@tutoratech.com", "password": "Admin@2024!" }'
```

### Voir les stats (avec cookie)
```bash
curl http://localhost:4000/api/dashboard/stats \
  -b cookies.txt
```

### Broadcast newsletter
```bash
curl -X POST http://localhost:4000/api/newsletter/broadcast \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "subject": "Notre actualité du mois",
    "html": "<h2>Bonjour !</h2><p>Voici nos nouvelles...</p>"
  }'
```

---

## 🗄️ Base de données

SQLite par défaut (développement). Pour passer en MySQL en production, modifie `.env` :

```env
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mail_manager
DB_USER=root
DB_PASS=your_password
```

Et installe le driver : `npm install mysql2`
