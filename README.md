# MotoTX - Plataforma de Gestión de Forfaits para Mototaxi

Plataforma digital para la gestión de paquetes de viajes prepagados (forfaits) de mototaxi en Bamako, Mali.

## 🚀 Características Principales

### Roles de Usuario
- **Admin**: Gestión de motoristas, forfaits, y supervisión general
- **Cliente**: Compra de forfaits y solicitud de viajes con tracking en tiempo real
- **Motorista**: Aceptación de viajes y gestión de servicios

### Funcionalidades Implementadas
- ✅ Autenticación JWT
- ✅ Sistema de Forfaits (paquetes prepagados)
- ✅ Solicitud y asignación de viajes
- ✅ **Tracking en tiempo real** con mapas (Leaflet)
- ✅ Aprobación de motoristas por Admin
- ✅ Gestión de estados de viaje (solicitado → aceptado → en curso → completado)
- ✅ Geolocalización del motorista visible para el cliente

## 🛠️ Stack Tecnológico

### Backend
- Laravel 12
- PHP 8.x
- MySQL/SQLite
- JWT Authentication (tymon/jwt-auth)

### Frontend
- React 18
- Vite
- React Router
- Axios
- Leaflet (Mapas)

## 📋 Requisitos Previos

- PHP >= 8.1
- Composer
- Node.js >= 18
- npm o yarn

## ⚙️ Instalación

### 1. Clonar el repositorio
```bash
cd mtx_nov/backend
```

### 2. Instalar dependencias del Backend
```bash
composer install
```

### 3. Configurar el entorno
```bash
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```

### 4. Configurar la base de datos
Edita `.env` y configura tu base de datos:
```env
DB_CONNECTION=sqlite
# O para MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=mototx
# DB_USERNAME=root
# DB_PASSWORD=
```

### 5. Ejecutar migraciones
```bash
php artisan migrate
```

### 6. Instalar dependencias del Frontend
```bash
npm install
```

## 🚀 Ejecutar la Aplicación

### Opción 1: Desarrollo (Recomendado)
Abre **dos terminales**:

**Terminal 1 - Backend:**
```bash
php artisan serve
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Accede a: **http://localhost:8000**

### Opción 2: Producción
```bash
npm run build
php artisan serve
```

## 👥 Usuarios de Prueba

Puedes crear usuarios manualmente o usar estos comandos:

### Crear Admin
```bash
php artisan tinker
```
```php
User::create([
    'name' => 'Admin',
    'email' => 'admin@test.com',
    'password' => Hash::make('password'),
    'rol' => 'admin',
    'telefono' => '00000000'
]);
```

### Crear Cliente
```php
$client = User::create([
    'name' => 'Cliente Test',
    'email' => 'client@test.com',
    'password' => Hash::make('password'),
    'rol' => 'cliente',
    'telefono' => '11111111'
]);

// Asignar forfait
ClienteForfait::create([
    'cliente_id' => $client->id,
    'viajes_restantes' => 10,
    'fecha_expiracion' => now()->addMonth(),
    'forfait_id' => 1
]);
```

### Crear Motorista
```bash
php create_test_motorista.php
```

## 🧪 Testing

### Simulación End-to-End
```bash
php debug_simulation_flow.php
```

Este script simula un ciclo completo:
1. Creación de usuarios
2. Aprobación de motorista
3. Compra de forfait
4. Solicitud de viaje
5. Aceptación y tracking
6. Finalización

### Testing Manual en Navegador

1. **Como Admin** (http://localhost:8000):
   - Login con `admin@test.com` / `password`
   - Ir a "Gestión de Motoristas"
   - Aprobar motoristas pendientes

2. **Como Cliente**:
   - Login con `client@test.com` / `password`
   - Hacer clic en el mapa para seleccionar origen y destino
   - Solicitar viaje
   - Ver el marcador "Tu Moto 🏍️" moviéndose en tiempo real

3. **Como Motorista**:
   - Login con `amadou@test.com` / `password`
   - Aceptar solicitud de viaje
   - Cambiar estado a "En curso" → "Completado"
   - El navegador pedirá permisos de ubicación

## 📁 Estructura del Proyecto

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/AdminController.php
│   │   │   ├── Auth/AuthController.php
│   │   │   └── Viajes/ViajeController.php
│   │   └── Middleware/
│   │       ├── AdminMiddleware.php
│   │       └── MotoristaMiddleware.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Viaje.php
│   │   ├── MotoristaPerfil.php
│   │   └── ClienteForfait.php
│   └── Services/
│       ├── ViajeService.php
│       └── MotoristaService.php
├── resources/
│   └── js/
│       ├── pages/
│       │   ├── Admin/
│       │   ├── Cliente/
│       │   └── Motorista/
│       └── context/
│           └── AuthContext.jsx
└── routes/
    └── api/
        ├── admin.php
        ├── user.php
        └── viajes.php
```

## 🔧 Configuración Importante

### Middleware
Los middleware están registrados en `bootstrap/app.php`:
```php
$middleware->alias([
    'admin' => \App\Http\Middleware\AdminMiddleware::class,
    'motorista' => \App\Http\Middleware\MotoristaMiddleware::class,
]);
```

### CORS
Si necesitas acceder desde otro dominio, configura CORS en `config/cors.php`

## 🐛 Bugs Conocidos Resueltos

- ✅ `useEffect` import faltante
- ✅ Parámetro `estado_validacion` en Admin
- ✅ Middleware no registrado
- ✅ Columnas de ubicación en MotoristaPerfil

## 📝 Próximos Pasos

- [ ] Notificaciones Push
- [ ] Historial completo de viajes
- [ ] Sistema de calificaciones UI
- [ ] Pasarela de pago real
- [ ] Despliegue en producción

## 📄 Licencia

Este proyecto es privado.

## 👨‍💻 Autor

Desarrollado para la gestión de servicios de mototaxi en Bamako, Mali.
