
#  Appointment Backend – Système de prise de rendez-vous en ligne

Backend REST API pour une plateforme de **prise de rendez-vous en ligne**, permettant aux citoyens de réserver des créneaux auprès de services (centres médicaux, administrations, etc.), avec **gestion intelligente des créneaux horaires**, **QR Code de validation** et **outils dédiés aux prestataires**.

Inspiré des systèmes réels (Doctolib-like), adapté au contexte local (ex : sans mot de passe, identification par numéro de téléphone).

---

##  Fonctionnalités principales

###  Citoyens

* Création de compte avec **numéro de téléphone uniquement**
* Recherche de services
* Consultation des créneaux disponibles par date
* Réservation d’un créneau
* Génération d’un **QR Code** pour le rendez-vous

###  Services / Prestataires

* Inscription de services et sous-services
* Définition des **horaires de travail**
* Gestion automatique des **time slots**
* Visualisation de la liste des clients par jour
* Marquage des clients : SERVI / ABSENT

###  Application de scan

* Scan du QR Code
* Vérification de la validité de la réservation
* Confirmation du passage du client

---

##  Architecture du projet

```
src/
├── config/
│   └── database.js
├── controllers/
│   ├── citoyen.controller.js
│   ├── service.controller.js
│   ├── reservation.controller.js
│   └── timeSlot.controller.js
├── models/
│   ├── citoyen.model.js
│   ├── service.model.js
│   ├── sousService.model.js
│   ├── horairesTravail.model.js
│   ├── timeSlot.model.js
│   └── reservation.model.js
├── services/
│   ├── citoyen.service.js
│   ├── service.service.js
│   └── reservation.service.js
├── routes/
│   ├── citoyen.routes.js
│   ├── service.routes.js
│   ├── reservation.routes.js
│   └── timeSlot.routes.js
├── middlewares/
│   ├── error.middleware.js
│   └── upload.middleware.js
├── utils/
│   ├── qr.util.js
│   └── date.util.js
└── app.js
```

---

##  Technologies utilisées

* **Node.js**
* **Express.js**
* **MySQL**
* **Multer** (upload d’images)
* **Day.js** (gestion dates/heures)
* **UUID / Crypto** (QR token)
* **Postman** (tests API)

---

##  Modèle de données (simplifié)

* `citoyens`
* `services`
* `sous_services`
* `villes`
* `horaires_travail`
* `time_slots`
* `reservations`

### Exemple : `reservations`

```sql
reservations (
  id,
  citoyen_id,
  service_id,
  sous_service_id,
  time_slot_id,
  date,
  heure,
  statut,
  qr_token,
  created_at
)
```

---

##  Gestion des créneaux (Time Slots)

* Les créneaux **ne sont pas créés à l’avance**
* Lorsqu’un client sélectionne une date :

  * le système vérifie si des créneaux existent
  * sinon, ils sont **générés dynamiquement** à partir de `horaires_travail`
* Capacité gérée par `capacity_restante`
* Zéro sur-réservation

---

##  QR Code – Principe

* Chaque réservation génère un `qr_token` unique
* Le QR Code contient uniquement ce token
* L’app de scan utilise :

  ```http
  GET /api/reservations/scan/:qrToken
  ```
* Sécurisé, non devinable, usage unique

---

## 📡 Endpoints principaux

### Citoyens

```http
POST   /api/citoyens/register
```

### Services

```http
POST   /api/services/register
GET    /api/services
```

### Créneaux

```http
GET    /api/time-slots/:serviceId?date=YYYY-MM-DD
```

### Réservations

```http
POST   /api/reservations
GET    /api/reservations/service/:serviceId?date=YYYY-MM-DD
GET    /api/reservations/scan/:qrToken
```

---

##  Tests avec Postman

* Type : `form-data`
* Upload image avec le champ `image` (File)
* Ne pas utiliser de guillemets dans les champs texte

---

##  Lancer le projet

```bash
# installer les dépendances
npm install

# configurer la base de données
# (voir config/database.js)

# lancer le serveur
npm run dev
```

---

##  Vision du projet

* Réduction des files d’attente
* Organisation des services
* Gain de temps pour citoyens et prestataires
* Solution adaptée aux usages locaux
* Évolutif : SMS, paiement, statistiques, cloud

---

##  Auteur

**Mohamed Sanogo**
Master Informatique – Université du Havre
Projet de système de prise de rendez-vous en ligne


