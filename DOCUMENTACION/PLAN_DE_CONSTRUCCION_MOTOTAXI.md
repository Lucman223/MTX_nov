# Plan de Construcción: Plataforma de Gestión de Forfaits para Mototaxi (MotoTX)

## 1. Objetivo del Proyecto

El objetivo es desarrollar una plataforma digital robusta y escalable, denominada "MotoTX", para la gestión de "forfaits" (paquetes de viajes prepagados) de mototaxi. La plataforma conectará a tres tipos de usuarios: **Clientes**, **Motoristas** y **Administradores**, optimizando la contratación, ejecución y pago de los servicios de transporte.

## 2. Roles de Usuario y Funcionamiento

### 2.1. Cliente

El cliente es el usuario final que consume los servicios de transporte.

- **Funcionamiento:**
    1.  **Registro/Inicio de Sesión:** El cliente se registra en la plataforma con sus datos personales (nombre, email, teléfono) y crea una contraseña.
    2.  **Gestión de Perfil:** Puede ver y editar su información personal.
    3.  **Visualización de Forfaits:** Explora los diferentes paquetes de viajes disponibles (ej: "Forfait 10 viajes", "Forfait mensual ilimitado"), viendo sus precios, condiciones y validez.
    4.  **Compra de Forfaits:** Selecciona un forfait y lo compra a través de una pasarela de pago integrada. Su cuenta se acredita con el número de viajes correspondiente.
    5.  **Solicitud de Viaje:** Cuando necesita un transporte, abre la aplicación, confirma su ubicación y solicita un viaje. El sistema descuenta un viaje de su forfait activo.
    6.  **Seguimiento:** Puede ver en tiempo real la ubicación del motorista asignado y el tiempo estimado de llegada.
    7.  **Historial y Calificación:** Al finalizar el viaje, puede calificar al motorista y dejar un comentario. También puede consultar su historial de viajes.

### 2.2. Motorista

El motorista es el proveedor del servicio de transporte.

- **Funcionamiento:**
    1.  **Registro Detallado:** Se registra proporcionando información personal, datos del vehículo (marca, modelo, matrícula) y documentos (licencia de conducir, seguro, foto de perfil).
    2.  **Proceso de Validación:** Su perfil queda en estado "pendiente" hasta que un administrador lo revisa y aprueba.
    3.  **Gestión de Estado:** Una vez aprobado, puede cambiar su estado a "Activo" (disponible para recibir solicitudes de viaje) o "Inactivo".
    4.  **Recepción de Solicitudes:** Cuando está "Activo", recibe notificaciones de solicitudes de viaje cercanas, con la ubicación del cliente. Puede aceptar o rechazar la solicitud.
    5.  **Navegación y Ejecución:** Al aceptar, recibe los detalles del destino y utiliza una interfaz de mapa para navegar. Marca el inicio y fin del viaje.
    6.  **Gestión de Ganancias:** Puede consultar un panel con el resumen de sus viajes realizados, las ganancias generadas y el historial de pagos recibidos por parte de la plataforma.

### 2.3. Administrador

El administrador supervisa y gestiona toda la plataforma.

- **Funcionamiento:**
    1.  **Dashboard General:** Accede a un panel de control con estadísticas clave: número de usuarios activos, viajes en curso, ingresos generados, etc.
    2.  **Gestión de Motoristas:** Ve la lista de motoristas registrados, revisa sus perfiles y documentos, y los aprueba o rechaza. Puede suspender o eliminar cuentas de motoristas.
    3.  **Gestión de Clientes:** Puede ver la lista de clientes, su historial de compras y viajes. Atiende disputas o problemas reportados.
    4.  **Gestión de Forfaits:** Crea, edita, activa o desactiva los diferentes tipos de forfaits (define nombre, precio, número de viajes, duración).
    5.  **Supervisión de Viajes:** Puede ver en un mapa todos los viajes que están en curso en tiempo real.
    6.  **Reportes y Finanzas:** Genera reportes de ingresos, uso de la plataforma y liquidaciones para los motoristas.

## 3. Arquitectura Técnica

### 3.1. Frontend (Cliente y Motorista)

- **Tecnología:** **React.js**
- **Estructura:**
    - **Single Page Application (SPA):** Una aplicación web moderna y rápida.
    - **Componentes Reutilizables:** Se crearán componentes para botones, formularios, mapas, perfiles de usuario, etc.
    - **Enrutamiento:** Se usará `react-router-dom` para gestionar las diferentes vistas de la aplicación (login, dashboard, solicitar viaje, etc.).
    - **Gestión de Estado:** Se podría utilizar `Context API` para estados simples o `Redux Toolkit` para una gestión más compleja y centralizada del estado de la aplicación (datos del usuario, estado del viaje, etc.).
    - **Comunicación con Backend:** Se realizarán llamadas a la API REST del backend usando `axios` o `fetch` para enviar y recibir datos.
    - **Interfaz de Mapas:** Integración con una librería como `Leaflet` o `Mapbox` para mostrar mapas y seguimiento en tiempo real.

### 3.2. Backend (API)

- **Tecnología:** **PHP**
- **Estructura:**
    - **API RESTful:** Se desarrollará una API con endpoints claros y bien definidos para cada funcionalidad (ej: `/api/usuarios/login`, `/api/viajes`, `/api/forfaits`).
    - **Framework (Recomendado):** Se recomienda usar un framework como **Laravel** o **Symfony**. Esto proporciona una estructura sólida, seguridad integrada (protección contra CSRF, XSS), un ORM (Eloquent/Doctrine) para interactuar con la base de datos de forma segura y herramientas para la creación rápida de APIs.
    - **Autenticación:** Se implementará un sistema de autenticación basado en tokens (ej: **JWT - JSON Web Tokens**). Tras el login, el cliente recibe un token que debe enviar en cada solicitud para verificar su identidad.
    - **Lógica de Negocio:** El backend contendrá toda la lógica para gestionar usuarios, validar forfaits, asignar viajes al motorista más cercano, procesar pagos y calcular ganancias.

### 3.3. Base de Datos

- **Tecnología:** **MySQL**
- **Función:** Almacenará toda la información persistente de la plataforma.

## 4. Diseño de la Base de Datos (Esquema Conceptual)

- **`usuarios`**:
    - `id` (PK), `nombre`, `email` (UNIQUE), `password`, `telefono`, `rol` (ENUM: 'cliente', 'motorista', 'admin'), `fecha_registro`.
- **`motoristas_perfiles`**:
    - `id` (PK), `usuario_id` (FK a `usuarios`), `marca_vehiculo`, `matricula`, `documento_licencia_path`, `estado_validacion` (ENUM: 'pendiente', 'aprobado', 'rechazado'), `estado_actual` (ENUM: 'activo', 'inactivo').
- **`forfaits`** (los tipos de paquetes que se venden):
    - `id` (PK), `nombre`, `descripcion`, `precio`, `viajes_incluidos`, `dias_validez`, `estado` (ENUM: 'activo', 'inactivo').
- **`clientes_forfaits`** (los paquetes que los clientes han comprado):
    - `id` (PK), `cliente_id` (FK a `usuarios`), `forfait_id` (FK a `forfaits`), `fecha_compra`, `fecha_expiracion`, `viajes_restantes`.
- **`viajes`**:
    - `id` (PK), `cliente_id` (FK a `usuarios`), `motorista_id` (FK a `usuarios`, nullable), `origen_lat`, `origen_lng`, `destino_lat`, `destino_lng`, `estado` (ENUM: 'solicitado', 'aceptado', 'en_curso', 'completado', 'cancelado'), `fecha_solicitud`, `fecha_fin`.
- **`calificaciones`**:
    - `id` (PK), `viaje_id` (FK a `viajes`), `calificador_id` (FK a `usuarios`), `calificado_id` (FK a `usuarios`), `puntuacion` (INT 1-5), `comentario`.
- **`transacciones`**:
    - `id` (PK), `cliente_id` (FK a `usuarios`), `monto`, `tipo` (ENUM: 'compra_forfait'), `pasarela_pago_id`, `fecha`.

## 5. Plan de Ejecución por Fases

1.  **Fase 1: Configuración y Núcleo de Usuarios (Backend)**
    - Configuración del entorno de desarrollo (PHP/Laravel, MySQL, Node/React).
    - Diseño e implementación del esquema de la base de datos.
    - Desarrollo de la API para registro, login (JWT) y gestión de perfiles de todos los roles.

2.  **Fase 2: Funcionalidad del Administrador y Forfaits**
    - Desarrollo del panel de administrador (React).
    - API y UI para que el admin pueda crear/editar/eliminar forfaits.
    - API y UI para que el admin pueda validar/gestionar motoristas.

3.  **Fase 3: Flujo del Cliente**
    - Desarrollo de la interfaz de cliente (React).
    - UI para ver y comprar forfaits (integración inicial con pasarela de pago).
    - API y UI para solicitar un viaje (descontando de su forfait).

4.  **Fase 4: Flujo del Motorista**
    - Desarrollo de la interfaz de motorista (React).
    - API y UI para que el motorista gestione su estado (Activo/Inactivo).
    - API y UI para recibir y aceptar/rechazar solicitudes de viaje.
    - Lógica de asignación de viajes en el backend.

5.  **Fase 5: Interacción y Cierre del Ciclo**
    - Integración del mapa en tiempo real (React) para seguimiento del viaje.
    - API y UI para que el motorista marque el viaje como "completado".
    - API y UI para que el cliente pueda calificar el viaje.
    - Desarrollo de los paneles de "Historial de Viajes" para cliente y motorista.

6.  **Fase 6: Pruebas, Despliegue y Mantenimiento**
    - Pruebas unitarias y de integración.
    - Pruebas de extremo a extremo (End-to-End) con usuarios piloto.
    - Despliegue del backend (servidor PHP/MySQL) y frontend (servidor web estático).
    - Monitorización y mantenimiento continuo.
