# MotoTX Platform Presentation

Welcome to the visual documentation of **MotoTX**, a comprehensive motorcycle transport platform that efficiently and safely connects customers with drivers.

Below, the user flow and key functionalities for each role within the system are detailed.

---

## 1. General Views

### Landing Page
The gateway to the platform. It presents the value proposition, allows quick access to registration and login, and offers general information about the service.
![Home Page](general_home.png)

### User Registration
A unified form allowing new users to register by selecting their role (Client or Driver). Clean design and real-time validation.
![User Registration](general_registro.png)

---

## 2. Role: Client
The client is the end-user requesting the transport service.

### Client Dashboard
The main panel where the client can:
- View their available trip balance (Forfaits).
- Request a new trip by selecting origin and destination on the interactive map.
- View the status of their current request.
![Client Dashboard](cliente_dashboard.png)

### Buying Forfaits
Section dedicated to trip recharging. Clients can purchase trip packages (forfaits) using integrated payment gateways (Orange Money Simulation).
![Buying Forfaits](cliente_forfaits.png)

### Trip History
Complete record of trips made, with details such as date, assigned driver, and trip status.
![Client History](cliente_historial.png)

### User Profile
Management of personal data, password, and account preferences.
![Client Profile](cliente_perfil.png)

---

## 3. Role: Driver
The driver is the service provider responsible for accepting and performing trips.

### Driver Dashboard
Daily work tool. It allows:
- Going "Online" or "Offline" to receive requests.
- Viewing and accepting new trip requests in real-time.
- Managing the current trip status (Accept -> In Progress -> Complete).
![Driver Dashboard](motorista_dashboard.png)

### Service History
Log of all trips completed by the driver, useful for tracking their activity.
![Driver History](motorista_historial.png)

### Driver Profile
Driver information.
![Driver Profile](motorista_perfil.png)

---

## 4. Role: Administrator
The administrator has full control over the platform, managing users, finances, and configurations.

### Administration Dashboard
Global view of the system status. Displays important KPIs such as:
- Total drivers and clients.
- Monthly revenue.
- Activity and performance charts.
![Admin Dashboard](admin_dashboard.png)

### Client Management
Complete table of all registered clients, allowing viewing details and managing accounts.
![Client Management](admin_clientes.png)

### Driver Management
Fleet control. Allows validating new drivers, viewing their status (active/inactive), and managing their profiles.
![Driver Management](admin_motoristas.png)

### Forfait Management
Configuration of trip packages and prices available to clients.
![Forfait Management](admin_forfaits.png)

### Global Trip History
Supervision of all trips made on the platform, with filters by status, date, and user.
![Global History](admin_viajes.png)

### Reports and Analytics
Advanced section for data-driven decision making, with detailed reports on platform usage.
![Reports](admin_reportes.png)
