# Estructura del Backend

Este documento describe la nueva estructura organizada para el backend y los principios que la rigen.

## Nueva Estructura de Carpetas (Visual)

Aquí se muestra una representación visual de la nueva organización de los directorios más importantes que hemos refactorizado.

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   │   └── AdminController.php
│   │   │   ├── Auth/
│   │   │   │   └── AuthController.php
│   │   │   ├── Pagos/
│   │   │   │   ├── ClienteForfaitController.php
│   │   │   │   ├── ForfaitController.php
│   │   │   │   └── OrangeMoneyController.php
│   │   │   ├── User/
│   │   │   │   └── MotoristaController.php
│   │   │   └── Viajes/
│   │   │       ├── CalificacionController.php
│   │   │       └── ViajeController.php
│   │   │
│   │   ├── Requests/
│   │   │   ├── Admin/
│   │   │   │   ├── UpdateMotoristaStatusRequest.php
│   │   │   │   └── UpdateUserRequest.php
│   │   │   ├── Auth/
│   │   │   │   ├── RegisterRequest.php
│   │   │   │   └── UpdateProfileRequest.php
│   │   │   ├── Pagos/
│   │   │   │   ├── BuyForfaitRequest.php
│   │   │   │   └── InitiatePaymentRequest.php
│   │   │   ├── User/
│   │   │   │   └── ...
│   │   │   └── Viajes/
│   │   │       └── ...
│   │   │
│   │   └── Middleware/
│   │       └── ...
│   │
│   ├── Models/
│   │   └── ...
│   │
│   └── Services/
│       ├── CalificacionService.php
│       ├── ForfaitService.php
│       ├── MotoristaService.php
│       ├── OrangeMoneyService.php
│       ├── UserService.php
│       └── ViajeService.php
│
└── routes/
    ├── api/
    │   ├── admin.php
    │   ├── auth.php
    │   ├── pagos.php
    │   ├── user.php
    │   └── viajes.php
    │
    └── api.php

```

---

## Principios y Explicaciones de la Estructura

### 1. Controladores por Categorías (`app/Http/Controllers`)

*   **Qué es:** Los controladores, que manejan las peticiones de los usuarios, ya no están todos juntos. Ahora están organizados en subcarpetas según su función (ej. `Auth`, `Pagos`, `Viajes`).
*   **Por qué:** Esto hace que sea mucho más fácil encontrar el código relevante, especialmente a medida que el proyecto crece. Reduce el desorden y mejora la claridad.

### 2. Rutas por Módulos (`routes/api/`)

*   **Qué es:** El archivo principal de rutas `routes/api.php` ha sido limpiado. La definición de cada grupo de rutas se ha movido a su propio archivo dentro de la nueva carpeta `routes/api/` (ej. `auth.php`, `viajes.php`).
*   **Por qué:** Al igual que con los controladores, esto modulariza la definición de las rutas, haciendo que cada archivo sea pequeño, enfocado y fácil de leer.

### 3. Validación Centralizada (`app/Http/Requests`)

*   **Qué es:** La lógica para validar los datos que envía un usuario (ej. que un email sea válido) se ha extraído a clases `FormRequest`.
*   **Por qué:** Esto limpia los controladores de la lógica de validación, permitiéndoles centrarse en su tarea principal. Además, estas reglas de validación se vuelven reutilizables en otras partes de la aplicación si es necesario.

### 4. Lógica de Negocio en Servicios (`app/Services`)

*   **Qué es:** Se ha creado una nueva capa de "Servicios" para alojar la lógica de negocio compleja.
*   **Por qué:** Esto sigue el principio de "controladores delgados". Los controladores ahora actúan como meros coordinadores, recibiendo la petición y delegando el "trabajo pesado" a un servicio. Esto hace que el código sea mucho más organizado, fácil de probar y reutilizable.