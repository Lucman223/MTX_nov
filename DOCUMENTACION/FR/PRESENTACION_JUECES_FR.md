# 🏍️ MotoTX - Documentation de Présentation Finale
**Durée Estimée :** 60 Minutes
**Public :** Juges Techniques et d'Affaires

---

## 1. 📢 Introduction et Vision (5 Minutes)

### Le Problème
À Bamako, le transport en moto-taxi est chaotique, dangereux et aux prix imprévisibles. Les clients ne savent pas à qui faire confiance et les conducteurs (motoristes) souffrent de revenus instables.

### La Solution : MotoTX
MotoTX n'est pas seulement une application de transport ; c'est un **écosystème professionnalisé**.
- **Pour le Client :** Sécurité (conducteurs validés), Prix fixes (Forfaits) et Rapidité.
- **Pour le Motoriste :** Outil de travail digne ("Pay-to-Work") qui garantit des clients sérieux.
- **Technologie :** Plateforme Web/PWA en temps réel, accessible et moderne.

---

## 2. 📱 Démonstration Fonctionnelle "En Direct" (20 Minutes)

*Scénario suggéré pour montrer le flux complet pendant la présentation :*

### Scénario A : Le Modèle d'Affaires (Abonnements)
1.  **Connexion Nouveau Motoriste** : Se connecter avec un utilisateur motoriste sans abonnement.
2.  **Tentative de "En Ligne"** : Montrer comment le système **bloque** l'accès : *"Accès Refusé : Abonnement Requis"*.
3.  **Achat de Plan** :
    - Aller à "Abonnements".
    - Expliquer les plans (Journalier, Hebdomadaire, VIP).
    - Simuler l'achat (Clic sur "Activer").
    - **Résultat** : Le système débloque le statut. Le motoriste passe "En Ligne" (Vert).
    - *Point Clé :* Cela démontre la monétisation B2B (Driver-as-Customer).

### Scénario B : Le Voyage en Temps Réel
1.  **Client Demande** :
    - Connexion comme Client.
    - Le Dashboard montre la carte et le solde de voyages ("Forfaits").
    - Demander un voyage (Origine/Destination).
2.  **Motoriste Reçoit** :
    - *Effet WOW* : Montrer les deux écrans en même temps. L'alerte apparaît chez le Motoriste instantanément (WebSockets).
3.  **Acceptation et Course** :
    - Motoriste accepte -> Client reçoit notification.
    - Changement d'états : En Cours -> Terminé.
4.  **Finalisation** :
    - Le solde de voyages du client diminue.
    - Le motoriste est libre pour le suivant.
4A. **Clôture Financière (Nouveau)** :
    - **Montrer Dashboard Motoriste** : Signaler la **Carte Verte de Gains**.
    - Expliquer : *"Ici le conducteur voit ses 1000 CFA intégraux et l'économie générée"*.

---

## 3. 🛠️ Architecture Technique (20 Minutes)

*Idéal pour répondre aux questions sur "Comment c'est fait".*

### Stack Technologique (Fiche Technique)

#### 1. Frontend (La Face Visible)
*   **Langage :** JavaScript (ES6+) avec JSX.
*   **Framework :** **React 19**. Nous utilisons les dernières fonctionnalités pour des performances optimales.
*   **Infrastructure :** **Railway**. Plateforme cloud assurant la haute disponibilité du Frontend et Backend via des conteneurs sécurisés.
*   **Routing :** **React Router v6**. Gère la navigation sans recharger la page (SPA), essentiel pour une expérience "App-like".
*   **État :** **Context API**. Nous gérons la session utilisateur (`AuthContext`) de manière globale sans bibliothèques lourdes comme Redux.

#### 2. Backend (Le Moteur)
*   **Langage :** PHP 8.2.
*   **Framework :** **Laravel 11**. Choisi pour sa sécurité, robustesse et élégance (MVC pur).
*   **Base de Données :** 
    *   **SQLite** (Demo/Dev) : Pour une portabilité immédiate.
    *   **MySQL 8.0** (Prod) : Pour une scalabilité massive.
*   **ORM :** **Eloquent**. Nous interagissons avec la BDD en utilisant des modèles orientés objets (`User`, `Viaje`), pas de SQL brut.

#### 3. Temps Réel (Le Cœur de MotoTX)
*   **Technologie :** **WebSockets** (Protocole `ws://`).
*   **Serveur :** **Laravel Reverb**.
    *   *Pourquoi c'est spécial* : C'est un serveur WebSocket **natif** de Laravel, écrit en PHP haute performance.
    *   *Avantage* : Coût zéro (nous ne payons pas Pusher) et latence minimale (<50ms) pour connecter Clients et Motoristes instantanément.

#### 4. API & Sécurité
*   **Authentification :** **JWT (JSON Web Tokens)**.
    *   Stateless : Le serveur ne garde pas de sessions, ce qui permet de scaler horizontalement.
*   **Protocole :** API RESTful standardisée. Le Frontend consomme du JSON du Backend.

### Sécurité et Conformité (Norme)
- **Rôles et Permissions :** Middleware strict (`MotoristaMiddleware`, `AdminMiddleware`). Personne n'entre où il ne doit pas.
- **RGPD (Confidentialité) :**
    - Politique de confidentialité accessible (`/privacy`).
    - **Droit à l'Oubli (Implémenté) :** Bouton "Supprimer Compte" dans le profil sécurisé. Effectue un **Soft Delete** + **Anonymisation** des données personnelles (email, téléphone, nom) pour respecter la loi sans briser l'intégrité des rapports historiques.
- **Accessibilité (WCAG AA) :**
    - **Mode Dyslexie :** Interrupteur flottant pour passer à la police OpenDyslexic.
    - Contraste des couleurs vérifié (>4.5:1).
    - Navigation au clavier et étiquettes ARIA pour les lecteurs d'écran.

### Base de Données (Structure Clé)
- **`users`** : Table unique avec discriminateur de `rol`.
- **`planes_motorista`** & **`suscripciones_motorista`** : Moteur du modèle d'affaires.
- **`suscripciones`** vs **`forfaits`** : Différenciation claire entre "Temps" (Motoristes paient pour le temps) et "Usage" (Clients paient pour les voyages).

---

## 4. 💼 Modèle d'Affaires et Différenciation (10 Minutes)

### Pourquoi ça marchera ?
1.  **Économie d'Échelle** : En vendant des "Packs de Voyages" (Forfaits) au client, nous assurons des liquidités à l'avance (Pré-paiement).
2.  **Filtre de Qualité** : En facturant un abonnement au motoriste, nous éliminons les conducteurs occasionnels ou dangereux. Seuls les professionnels paient pour travailler.
3.  **Scalabilité** : L'architecture découplée permet de lancer des Apps iOS/Android natives dans le futur en utilisant la même API.

### 💰 Flux d'Argent (Revenue Model)
*Explication clé pour le jury :*

1.  **Revenu pour la Plateforme (MotoTX)** :
    *   **B2C (Client)** : Achète des Forfaits (ex. 5000 CFA). L'argent entre chez MotoTX.
    *   **B2B (Motoriste)** : Paie l'Abonnement (ex. 2500 CFA). L'argent entre chez MotoTX.

2.  **Revenu pour le Motoriste** :
    *   Comment gagne-t-il si le client paie avec un Forfait (Virtuel) ?
    *   **Réponse** : Le système fonctionne avec **Liquidation (Settlement)**. Chaque voyage réalisé avec Forfait génère un solde en faveur du conducteur dans le système.
    *   La plateforme permet aux conducteurs d'effectuer des **Retraits Quotidiens** de leurs gains vers leur compte Orange Money.
    *   *Note :* Dans cette version MVP, nous ne montrons pas le module de "Payouts" (Paiements aux conducteurs), mais c'est une partie du Back-office administratif.

---

## 5. ❓ Questions Fréquentes (Q&A Prep) (5 Minutes)

**Q : Que se passe-t-il si internet coupe ?**
R : La PWA a des stratégies de cache (Service Workers) pour charger l'interface de base, bien qu'une connexion soit requise pour demander des voyages.

**Q : Le paiement est-il sécurisé ?**
R : L'intégration est prête pour les APIs de Mobile Money (Orange Money, Moov). Nous ne stockons pas de cartes, seulement des tokens de transaction.

**Q : Comment gérez-vous la localisation ?**
R : Nous utilisons l'API de Géolocalisation du navigateur (HTML5) en envoyant les coordonnées au backend toutes les 10 secondes tant que le voyage est actif.

### 6. 📊 Plan d'Affaires : Lancement à Bamako
*Détail financier pour la mise en marche :*

**Modèle Choisi : Abonnement Pur (0% Commission)**
Contrairement à Uber/Yango qui prennent 20-25% par voyage, MotoTX facture un **frais fixe journalier**. Cela responsabilise le conducteur : "Plus tu travailles, plus tu gagnes".

#### A. Gains du Motoriste 🏍️
*Exemple Réel :*
- **Revenus** : Réalise 10 voyages par jour à un prix moyen de **1.000 CFA**.
    - Total Brut : **10.000 CFA / jour**.
- **Dépenses** :
    - Essence : ~2.000 CFA.
    - Abonnement MotoTX (Pass Jour) : **500 CFA**.
- **Gain Net (Poche)** : **7.500 CFA / jour**.
    - *Avantage :* S'il fait 20 voyages, il continue de payer seulement 500 CFA à la plateforme.

#### B. Gains de la Plateforme (MotoTX) 🏢
Nos revenus sont récurrents et prévisibles (SaaS) :
- **Abonnements** :
    - Si nous captons **100 Motoristes** actifs :
    - 100 x 500 CFA = **50.000 CFA / jour** (1.500.000 CFA / mois).
- **Cash Flow (Forfaits)** :
    - Les clients achètent du solde à l'avance. Nous avons des liquidités financières avant de payer les conducteurs (Règlement hebdomadaire).

#### C. Avantage Concurrentiel
- **Prix Fixe pour le Motoriste** : Ils savent exactement combien ils paieront. Sans surprises.
- **Transparence** : L'algorithme ne leur "vole" pas de pourcentage.
- **Fidélisation** : Un conducteur avec abonnement mensuel ("VIP") n'ira pas à la concurrence car il a déjà payé son mois.

---

### 📝 Notes pour le Présentateur
- **Ambiance** : Assurez-vous d'avoir le Backend (`php artisan serve`) et le WebSocket (`php artisan reverb:start`) en marche avant de commencer.
- **Langue** : La démo est configurée en Espagnol, mais rappelez-vous de montrer le changement de langue vers Français/Arabe pour impressionner avec la localisation régionale.
