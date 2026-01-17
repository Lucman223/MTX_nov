# Présentation de la Plateforme MotoTX

Bienvenue dans la documentation visuelle de **MotoTX**, une plateforme complète de transport à moto qui connecte efficacement et en toute sécurité les clients aux conducteurs.

Ci-dessous, nous détaillons le flux utilisateur et les fonctionnalités clés pour chaque rôle au sein du système.

---

## 1. Vues Générales

### Page d'Accueil (Landing Page)
La porte d'entrée de la plateforme. Elle présente la proposition de valeur, permet un accès rapide à l'inscription et à la connexion, et fournit des informations générales sur le service.
![Page d'Accueil](general_home.png)

### Inscription des Utilisateurs
Un formulaire unifié permettant aux nouveaux utilisateurs de s'inscrire en sélectionnant leur rôle (Client ou Conducteur). Design épuré et validation en temps réel.
![Inscription Utilisateur](general_registro.png)

---

## 2. Rôle : Client
Le client est l'utilisateur final qui demande le service de transport.

### Tableau de Bord Client (Dashboard)
Le panneau principal où le client peut :
- Voir son solde de trajets disponibles (Forfaits).
- Demander un nouveau trajet en sélectionnant l'origine et la destination sur la carte interactive.
- Voir l'état de sa demande actuelle.
![Dashboard Client](cliente_dashboard.png)

### Achat de Forfaits
Section dédiée au rechargement de trajets. Les clients peuvent acheter des packs de trajets (forfaits) en utilisant des passerelles de paiement intégrées (Simulation Orange Money).
![Achat de Forfaits](cliente_forfaits.png)

### Historique des Trajets
Registre complet des trajets effectués, avec des détails tels que la date, le conducteur assigné et l'état du trajet.
![Historique Client](cliente_historial.png)

### Profil Utilisateur
Gestion des données personnelles, du mot de passe et des préférences du compte.
![Profil Client](cliente_perfil.png)

---

## 3. Rôle : Conducteur (Motorista)
Le conducteur est le prestataire de service, chargé d'accepter et d'effectuer les trajets.

### Tableau de Bord Conducteur
Outil de travail quotidien. Il permet de :
- Se mettre "En Ligne" ou "Hors Ligne" pour recevoir des demandes.
- Voir et accepter de nouvelles demandes de trajet en temps réel.
- Gérer l'état du trajet actuel (Accepter -> En Cours -> Terminer).
![Dashboard Conducteur](motorista_dashboard.png)

### Historique des Services
Journal de tous les trajets effectués par le conducteur, utile pour suivre son activité.
![Historique Conducteur](motorista_historial.png)

### Profil du Conducteur
Informations personnelles du conducteur.
![Profil Conducteur](motorista_perfil.png)

---

## 4. Rôle : Administrateur (Admin)
L'administrateur a un contrôle total sur la plateforme, gérant les utilisateurs, les finances et les configurations.

### Tableau de Bord d'Administration
Vue globale de l'état du système. Affiche des KPI importants tels que :
- Total des conducteurs et des clients.
- Revenus du mois.
- Graphiques d'activité et de performance.
![Dashboard Admin](admin_dashboard.png)

### Gestion des Clients
Tableau complet de tous les clients inscrits, permettant de voir les détails et de gérer les comptes.
![Gestion Clients](admin_clientes.png)

### Gestion des Conducteurs
Contrôle de la flotte. Permet de valider les nouveaux conducteurs, de voir leur statut (actif/inactivo) et de gérer leurs profils.
![Gestion Conducteurs](admin_motoristas.png)

### Gestion des Forfaits
Configuration des packs de trajets et des prix disponibles pour les clients.
![Gestion Forfaits](admin_forfaits.png)

### Historique Global des Trajets
Supervision de tous les trajets effectués sur la plateforme, avec des filtres par état, date et utilisateur.
![Historique Global](admin_viajes.png)

### Rapports et Analyses
Section avancée pour la prise de décision basée sur les données, avec des rapports détaillés sur l'utilisation de la plateforme.
![Rapports](admin_reportes.png)
