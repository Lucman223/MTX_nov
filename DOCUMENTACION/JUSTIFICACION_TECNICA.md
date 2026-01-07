# 🧠 Justificación Técnica - MotoTX

Este documento detalla las decisiones de ingeniería detrás de MotoTX. Está diseñado para responder a las preguntas de "por qué" de un jurado técnico, demostrando un entendimiento profundo del stack y las mejores prácticas.

---

## 1. Arquitectura del Sistema
### ¿Por qué Laravel + React?
Elegimos un enfoque **Decoupled (Desacoplado)** pero dentro de un mismo ecosistema (Monolito Moderno):
- **Laravel (Backend)**: Ofrece una base sólida para APIs REST, manejo de base de datos (Eloquent ORM) y seguridad robusta out-of-the-box.
- **React (Frontend)**: Permite crear una interfaz reactiva de alta velocidad. Al ser una **SPA (Single Page Application)**, la navegación es instantánea y se siente como una aplicación nativa.
- **Vite**: Usamos Vite como empaquetador porque es significativamente más rápido que Webpack, lo que optimiza el ciclo de desarrollo y la carga en producción.

---

## 2. Patrones de Diseño
### Patrón Service (Service Pattern)
En lugar de poner toda la lógica en los Controladores, usamos una capa de **Servicios** (ej. `MotoristaService.php`).
- **Justificación**: Cumplimos con el principio de **Responsabilidad Única (SRP)**. El controlador solo recibe la petición y devuelve la respuesta; la lógica de negocio compleja (validaciones de viajes, cálculos de forfaits) vive en el Servicio. Esto facilita enormemente el mantenimiento y los tests automatizados.

---

## 3. Seguridad y Autenticación
### Autenticación Stateless con JWT
Usamos **JSON Web Tokens (JWT)** en lugar de sesiones tradicionales de PHP.
- **Por qué JWT**: Permite que el backend sea *stateless* (sin estado). El servidor no necesita guardar archivos de sesión, lo que hace al sistema más escalable.
- **Seguridad Senior**: 
    1.  **Validación en Backend**: Inicialmente se decodificaba el token en el cliente. Lo eliminamos y creamos un endpoint `/auth/verify` en el backend para validar el token de forma segura, evitando que un atacante manipule la lógica del frontend.
    2.  **Secretos**: Los secretos de JWT están externalizados en el archivo `.env`. Nunca se suben al control de versiones (`.gitignore`), protegiendo la integridad de la plataforma.

---

## 4. Tiempo Real y Mapas
### WebSockets con Laravel Reverb
Para el tracking de los motoristas en el mapa, no usamos "polling" (preguntar cada pocos segundos), sino **WebSockets**.
- **Justificación**: El polling satura el servidor con peticiones innecesarias. Con WebSockets (usando Laravel Reverb), el servidor "empuja" la ubicación al cliente solo cuando cambia, reduciendo el consumo de datos y batería en móviles.
### Leaflet.js
Elegimos Leaflet por ser ligero y open-source, ideal para Bamako donde la velocidad de internet puede ser limitada, a diferencia de otras librerías más pesadas como Google Maps API.

---

## 5. Internacionalización (i18n)
La aplicación soporta Español, Francés, Árabe e Inglés.
- **Implementación**: Usamos `i18next` en el frontend y locales en el backend.
- **RTL (Right-to-Left)**: Hemos implementado soporte para Árabe, ajustando dinámicamente la dirección del layout (`dir="rtl"`) y los espejados de CSS para garantizar la usabilidad en la región del Sahel.

---

## 6. Base de Datos
### Normalización y Relaciones
- Usamos **Estructura de Roles**: Una sola tabla `users` con una columna `rol`. Esto simplifica enormemente la autenticación y permite que un usuario pueda cambiar de rol sin duplicar datos.
- **Estructura de Forfaits**: Separamos `forfaits` (catálogo) de `cliente_forfaits` (compras actuales). Esto permite cambiar los precios del catálogo sin afectar los viajes que un cliente ya compró.

---

## 7. Optimización y Rendimiento
- **Middlewares**: Implementamos capas de seguridad (`AdminMiddleware`, `MotoristaMiddleware`) que verifican los permisos antes de que la petición siquiera llegue a la lógica del controlador, ahorrando recursos del servidor.
- **Lazy Loading**: En el frontend, las páginas se cargan bajo demanda para reducir el peso inicial de la aplicación.

---

## 8. Estrategia de Producto y Negocio (No Técnico)
### ¿Por qué el modelo de Forfaits (Clientes)?
- **Liquidez Anticipada**: El cliente paga antes de consumir el viaje. Esto genera capital de trabajo para la plataforma.
- **Fidelización**: Al tener viajes prepagados, el cliente tiene un incentivo para elegir nuestra plataforma sobre la competencia informal.

### ¿Por qué el modelo de Suscripción (Motoristas)?
- **Filtro de Profesionalismo**: Actúa como una barrera de entrada. Solo los motoristas serios que ven la plataforma como una herramienta de trabajo están dispuestos a pagar la suscripción.
- **Monetización B2B**: Independiza los ingresos de la plataforma de las comisiones por viaje, ofreciendo ingresos más predecibles a la empresa.

### El Modelo "Earn-as-you-go" (Retiro Diario)
- **Adaptación Cultural**: En África Occidental, muchos trabajadores operan con ingresos diarios. Hemos implementado una **Billetera Digital** que permite al motorista retirar sus ganancias el mismo día que las genera.
- **Incentivo Inmediato**: Ver el saldo crecer y poder cobrarlo al instante fomenta una mayor retención de conductores y mayor actividad en la plataforma.

### UX y Diseño Adaptado
- **Mobile First**: Diseñado pensando en pantallas pequeñas y conexiones inestables.
- **Inclusión Cultural**: El soporte para **Árabe (RTL)** y **Francés** no es solo un detalle técnico, es una estrategia de mercado para Bamako y la región del Sahel, donde conviven múltiples lenguas.

---

## 9. 🚀 Posibles Preguntas de los Jueces (Q&A)

### ❓ "Vuestro sistema de pagos parece complejo, ¿cómo le pagáis al conductor si el cliente usa un Forfait?"
> **Respuesta Sugerida**: "El sistema de Forfaits funciona como un crédito interno. Cada vez que un conductor completa un viaje de Forfait, su 'bolsa de ganancias' virtual aumenta. La plataforma realiza liquidaciones semanales a los conductores mediante Orange Money o Moov, asegurando que reciban su dinero de forma segura y digital."

### ❓ "¿Por qué no habéis hecho una App nativa (Android/iOS) en vez de una Web?"
> **Respuesta Sugerida**: "Hemos elegido una **PWA (Progressive Web App)** por tres razones: 1. Velocidad de despliegue, 2. No requiere que el usuario descargue una App pesada (ahorro de datos), y 3. Es multiplataforma. Sin embargo, nuestra arquitectura de API Laravel está lista para conectar con Apps nativas en una Fase 2."

### ❓ "¿Cómo pensáis escalar si mañana tenéis 10,000 viajes a la vez?"
> **Respuesta Sugerida**: "Técnicamente, hemos usado **Laravel Reverb** para WebSockets y **JWT Stateless** para la autenticación. Esto significa que podemos añadir más servidores de backend sin preocuparnos por las sesiones de usuario. Además, el uso de servicios (Service Pattern) nos permitiría extraer procesos pesados a microservicios si fuera necesario."

### ❓ "¿Qué pasa si un conductor no tiene internet en mitad del viaje?"
> **Respuesta Sugerida**: "El flujo de viaje está diseñado para ser resiliente. Si el conductor pierde conexión, el estado del viaje se mantiene en el servidor. Al recuperar internet, el frontend se sincroniza automáticamente con el último estado conocido gracias a nuestra gestión de estado global en React."

### ❓ "¿Qué pasa si un conductor quiere su dinero hoy mismo?"
> **Respuesta Sugerida**: "Esa es una de nuestras mayores ventajas competitivas. A diferencia de Uber o Bolt que suelen liquidar semanalmente, MotoTX permite el **Retiro Diario**. Entendemos la cultura local de trabajar para el día a día, por lo que el conductor puede pulsar 'Retirar Ganancias' y recibir su saldo mediante Mobile Money instantáneamente."

### ❓ "¿Cómo garantizáis la seguridad de los clientes?"
> **Respuesta Sugerida**: "No solo validamos técnicamente con JWT, sino que tenemos un flujo administrativo: ningún motorista puede trabajar sin que un Administrador valide manualmente su licencia y matrícula en el panel de control. Además, el tracking en tiempo real permite supervisar cualquier viaje activo."
