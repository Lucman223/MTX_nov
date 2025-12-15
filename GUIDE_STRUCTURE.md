# Guide de Structure du Projet MotoTaxi (MTX)

Ce document sert de carte pour naviguer dans le code source du projet. Le projet utilise une architecture **Monolithique** : le backend (Laravel) et le frontend (React) résident dans le même dépôt et le backend sert l'application frontend.

---

## 🌎 Vue d'Ensemble

*   **Backend** : Laravel (PHP). Gère la base de données, l'authentification, la logique métier et fournit une API REST.
*   **Frontend** : React (JavaScript). C'est l'interface utilisateur qui interagit avec le backend via l'API.
*   **Emplacement** : Tout le code source se trouve dans le dossier `backend/` (même s'il inclut le frontend).

---

## 🔧 Structure du Backend (Laravel)

Le backend suit une architecture modulaire pour garder le code organisé.

### 📂 `app/Http/Controllers` (Contrôleurs)
C'est ici que les requêtes API arrivent. Ils sont organisés par dossiers selon leur fonction :
*   **`Auth/`** : Inscription, Connexion, Déconnexion (`AuthController.php`).
*   **`User/`** : Profil des utilisateurs et conducteurs (`MotoristaController.php`).
*   **`Pagos/`** : Gestion des forfaits et paiements (`ForfaitController.php`, `OrangeMoneyController.php`).
*   **`Viajes/`** : Demande de trajets, historique (`ViajeController.php`).

### 📂 `app/Services` (Services)
Contiennent la **logique métier "lourde"**. Les contrôleurs appellent ces services.
*   *Exemple* : `MotoristaService.php` gère la logique complexe de changement d'état ou d'attribution de conducteurs, gardant le contrôleur propre.

### 📂 `routes/api` (Routes)
Définit les URLs disponibles pour le frontend.
*   `auth.php` : routes de connexion/inscription.
*   `viajes.php` : routes pour créer et voir les trajets.
*   `user.php` : routes de profil.

### 📂 `app/Models` (Modèles)
Représentent les tables de la base de données (Ex : `User`, `Viaje`, `MotoristaPerfil`).

---

## 🎨 Structure du Frontend (React)

Le code du frontend se trouve dans `backend/resources/js`.

### 📂 `resources/js/pages` (Pages)
Ce sont les écrans principaux de l'application.
*   Contient des sous-dossiers comme `Public`, `Cliente`, `Motorista`, `Admin`.
*   *Exemple* : `pages/Motorista/MotoristaDashboard.jsx` est l'écran principal du conducteur.

### 📂 `resources/js/components` (Composants)
Pièces réutilisables de l'interface.
*   `RatingModal.jsx` : Modale pour noter les trajets.
*   `Viaje.jsx` : Composant pour afficher les informations d'un trajet.

### 📂 `resources/js/context` (État Global)
Gère les données qui doivent être accessibles dans toute l'app.
*   `AuthContext.jsx` : Stocke les informations de l'utilisateur connecté (client ou conducteur) pour que toute l'app sache qui vous êtes.

### 📂 `resources/js/services` (Services API)
Fonctions pour appeler le backend.
*   Aident à centraliser les appels API (Axios).

### 📄 Fichiers Clés
*   **`App.jsx`** : Définit les routes du frontend (qui peut voir quelle page).
*   **`app_entry.jsx`** : Point d'entrée où React s' "injecte" dans le HTML.

---

## 🔗 Comment ils interagissent

1.  **Chargement Initial** : Quand vous accédez au site web, Laravel charge `resources/views/welcome.blade.php`.
2.  **Injection** : Ce fichier charge Vite, qui injecte l'application React (`app_entry.jsx`) dans le `div id="root"`.
3.  **Navigation** : À partir de là, `React Router` (dans `App.jsx`) gère la navigation sans recharger la page.
4.  **Données** : Quand vous avez besoin de données (ex : demander un trajet), React fait une requête HTTP aux routes API de Laravel (`routes/api/viajes.php`).
