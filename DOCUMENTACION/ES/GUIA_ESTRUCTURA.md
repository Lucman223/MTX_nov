# Guía de Estructura del Proyecto MotoTaxi (MTX)

Este documento sirve como mapa para navegar por el código fuente del proyecto. El proyecto utiliza una arquitectura **Monolítica**: el backend (Laravel) y el frontend (React) viven en el mismo repositorio y el backend sirve la aplicación frontend.

---

## 🌎 Visión General

*   **Backend**: Laravel (PHP). Gestiona la base de datos, la autenticación, la lógica de negocio y provee una API REST.
*   **Frontend**: React (JavaScript). Es la interfaz de usuario que interactúa con el backend a través de la API.
*   **Ubicación**: Todo el código fuente está dentro de la carpeta `backend/` (aunque incluya el frontend).

---

## 🔧 Estructura del Backend (Laravel)

El backend sigue una arquitectura modular para mantener el código organizado.

### 📂 `app/Http/Controllers` (Controladores)
Aquí es donde llegan las peticiones de la API. Están organizados por carpetas según su función:
*   **`Auth/`**: Registro, Login, Logout (`AuthController.php`).
*   **`User/`**: Perfil de usuarios y conductores (`MotoristaController.php`).
*   **`Pagos/`**: Gestión de forfaits y pagos (`ForfaitController.php`, `OrangeMoneyController.php`).
*   **`Viajes/`**: Solicitud de viajes, historial (`ViajeController.php`).

### 📂 `app/Services` (Servicios)
Contienen la **lógica de negocio "pesada"**. Los controladores llaman a estos servicios.
*   *Ejemplo*: `MotoristaService.php` maneja la lógica compleja de cambiar estados o asignar conductores, manteniendo el controlador limpio.

### 📂 `routes/api` (Rutas)
Define las URLs disponibles para el frontend.
*   `auth.php`: rutas de login/registro.
*   `viajes.php`: rutas para crear y ver viajes.
*   `user.php`: rutas de perfil.

### 📂 `app/Models` (Modelos)
Representan las tablas de la base de datos (Ej: `User`, `Viaje`, `MotoristaPerfil`).

---

## 🎨 Estructura del Frontend (React)

El código del frontend se encuentra en `backend/resources/js`.

### 📂 `resources/js/pages` (Páginas)
Son las pantallas principales de la aplicación.
*   Contiene subcarpetas como `Public`, `Cliente`, `Motorista`, `Admin`.
*   *Ejemplo*: `pages/Motorista/MotoristaDashboard.jsx` es la pantalla principal del conductor.

### 📂 `resources/js/components` (Componentes)
Piezas reutilizables de la interfaz.
*   `RatingModal.jsx`: Modal para calificar viajes.
*   `Viaje.jsx`: Componente para mostrar información de un viaje.

### 📂 `resources/js/context` (Estado Global)
Maneja datos que necesitan ser accesibles en toda la app.
*   `AuthContext.jsx`: Guarda la información del usuario logueado (si es cliente o motorista) para que toda la app sepa quién eres.

### 📂 `resources/js/services` (Servicios API)
Funciones para llamar al backend.
*   Ayudan a centralizar las llamadas a la API (Axios).

### 📄 Archivos Clave
*   **`App.jsx`**: Define las rutas del frontend (quién puede ver qué página).
*   **`app_entry.jsx`**: Punto de entrada donde React se "inyecta" en el HTML.

---

## 🔗 Cómo se Conectan

1.  **Carga Inicial**: Cuando entras a la web, Laravel carga `resources/views/welcome.blade.php`.
2.  **Inyección**: Este archivo carga Vite, que inyecta la aplicación React (`app_entry.jsx`) en el `div id="root"`.
3.  **Navegación**: A partir de ahí, `React Router` (en `App.jsx`) maneja la navegación sin recargar la página.
4.  **Datos**: Cuando necesitas datos (ej. pedir un viaje), React hace una petición HTTP a las rutas de API de Laravel (`routes/api/viajes.php`).
