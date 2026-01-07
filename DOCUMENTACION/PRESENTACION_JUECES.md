# 🏍️ MotoTX - Documentación de Presentación Final
**Duración Estimada:** 60 Minutos
**Audiencia:** Jueces Técnicos y de Negocio

---

## 1. 📢 Introducción y Visión (5 Minutos)

### El Problema
En Bamako, el transporte en moto-taxi es caótico, inseguro y con precios impredecibles. Los clientes no saben en quién confiar y los conductores (motoristas) sufren de ingresos inestables.

### La Solución: MotoTX
MotoTX no es solo una app de transporte; es un **ecosistema profesionalizado**.
- **Para el Cliente:** Seguridad (conductores validados), Precios fijos (Forfaits) y Rapidez.
- **Para el Motorista:** Herramienta de trabajo digna ("Pay-to-Work") que garantiza clientes serios.
- **Tecnología:** Plataforma Web/PWA en tiempo real, accesible y moderna.

---

## 2. 📱 Demostración Funcional "En Vivo" (20 Minutos)

*Guion sugerido para mostrar el flujo completo durante la presentación:*

### Escenario A: El Modelo de Negocio (Suscripciones)
1.  **Login Motorista Nuevo**: Entrar con un usuario motorista sin suscripción.
2.  **Intento de "En Línea"**: Mostrar cómo el sistema **bloquea** el acceso: *"Acceso Denegado: Suscripción Requerida"*.
3.  **Compra de Plan**:
    - Ir a "Suscripciones".
    - Explicar los planes (Diario, Semanal, VIP).
    - Simular compra (Click en "Activar").
    - **Resultado**: El sistema desbloquea el estado. El motorista se pone "En Línea" (Verde).
    - *Punto Clave:* Esto demuestra la monetización B2B (Driver-as-Customer).

### Escenario B: El Viaje en Tiempo Real
1.  **Cliente Solicita**:
    - Login como Cliente.
    - Dashboard muestra mapa y saldo de viajes ("Forfaits").
    - Solicitar viaje (Origen/Destino).
2.  **Motorista Recibe**:
    - *Efecto WOW*: Mostrar las dos pantallas a la vez. La alerta salta en el Motorista instantáneamente (WebSockets).
3.  **Aceptación y Curso**:
    - Motorista acepta -> Cliente recibe notificación.
    - Cambio de estados: En Curso -> Completado.
4.  **Finalización**:
    - El saldo de viajes del cliente se reduce.
    - El saldo de viajes del cliente se reduce.
    - El motorista queda libre para el siguiente.
4A. **Cierre Financiero (Nuevo)**:
    - **Mostrar Dashboard Motorista**: Señalar la **Tarjeta Verde de Ganancias**.
    - Explicar: *"Aquí el conductor ve sus 1000 CFA íntegros y el ahorro generado"*.

---

## 3. 🛠️ Arquitectura Técnica (20 Minutos)

*Ideal para responder a las preguntas de "Cómo está hecho".*

### Stack Tecnológico (Ficha Técnica)

#### 1. Frontend (La Cara Visible)
*   **Lenguaje**: JavaScript (ES6+) con JSX.
*   **Framework**: **React 18**. Usamos Hooks (`useState`, `useEffect`) para toda la lógica de estado.
*   **Build Tool**: **Vite**. Permite un desarrollo ultra-rápido (HMR) y builds optimizados para producción.
*   **Routing**: **React Router v6**. Maneja la navegación sin recargar la página (SPA), esencial para una experiencia "App-like".
*   **Estado**: **Context API**. Gestionamos la sesión del usuario (`AuthContext`) de forma global sin necesidad de librerías pesadas como Redux.

#### 2. Backend (El Motor)
*   **Lenguaje**: PHP 8.2.
*   **Framework**: **Laravel 10**. Elegido por su seguridad, robustez y elegancia (MVC puro).
*   **Base de Datos**: 
    *   **SQLite** (Demo/Dev): Para portabilidad inmediata.
    *   **MySQL 8.0** (Prod): Para escalabilidad masiva.
*   **ORM**: **Eloquent**. Interactuamos con la BDD usando modelos orientados a objetos (`User`, `Viaje`), no SQL crudo.

#### 3. Tiempo Real (El Corazón de MotoTX)
*   **Tecnología**: **WebSockets** (Protocolo `ws://`).
*   **Servidor**: **Laravel Reverb**.
    *   *Por qué es especial*: Es un servidor WebSocket **nativo** de Laravel, escrito en PHP de alto rendimiento.
    *   *Ventaja*: Cero coste (no pagamos a Pusher) y latencia mínima (<50ms) para conectar Clientes y Motoristas al instante.

#### 4. API & Seguridad
*   **Autenticación**: **JWT (JSON Web Tokens)**.
    *   Stateless: El servidor no guarda sesiones, lo que permite escalar horizontalmente.
*   **Protocolo**: API RESTful estandarizada. El Frontend consume JSON del Backend.

### Seguridad y Compliance (Normativa)
- **Roles y Permisos**: Middleware estricto (`MotoristaMiddleware`, `AdminMiddleware`). Nadie entra donde no debe.
- **RGPD (Privacidad)**:
    - Política de privacidad accesible.
    - Funcionalidad de "Derecho al Olvido" (Eliminación de cuenta).
- **Accesibilidad (WCAG AA)**:
    - Contraste de colores verificado (>4.5:1).
    - Navegación por teclado y etiquetas ARIA para lectores de pantalla.

### Base de Datos (Estructura Clave)
- **`users`**: Tabla única con discriminador de `rol`.
- **`planes_motorista`** & **`suscripciones_motorista`**: Motor del modelo de negocio.
- **`suscripciones`** vs **`forfaits`**: Diferenciación clara entre "Tiempo" (Motoristas pagan por tiempo) y "Uso" (Clientes pagan por viajes).

---

## 4. 💼 Modelo de Negocio y Diferenciación (10 Minutos)

### ¿Por qué funcionará?
1.  **Economía de Escala**: Al vender "Packs de Viajes" (Forfaits) al cliente, aseguramos liquidez por adelantado (Pre-pago).
2.  **Filtro de Calidad**: Al cobrar suscripción al motorista, eliminamos a los conductores ocasionales o peligrosos. Solo los profesionales pagan por trabajar.
3.  **Escalabilidad**: La arquitectura desacoplada permite lanzar Apps iOS/Android nativas en el futuro usando la misma API.

### 💰 Flujo de Dinero (Revenue Model)
*Explicación clave para el jurado:*

1.  **Ingreso para la Plataforma (MotoTX)**:
    *   **B2C (Cliente)**: Compra Forfaits (ej. 5000 CFA). El dinero entra a MotoTX.
    *   **B2B (Motorista)**: Paga Suscripción (ej. 2500 CFA). El dinero entra a MotoTX.

2.  **Ingreso para el Motorista**:
    *   ¿Cómo cobra si el cliente paga con Forfait (Virtual)?
    *   **Respuesta**: El sistema funciona con **Liquidación (Settlement)**. Cada viaje realizado con Forfait genera un saldo a favor del conductor en el sistema.
    *   La plataforma paga a los conductores periódicamente (semanal/mensual) el valor de los viajes realizados, descontando la comisión (o sin comisión si pagan suscripción VIP).
    *   *Nota:* En esta versión MVP no mostramos el módulo de "Payouts" (Pagos a conductores), pero es parte del Back-office administrativo.

---

## 5. ❓ Preguntas Frecuentes (Q&A Prep) (5 Minutos)

**P: ¿Qué pasa si falla internet?**
R: La PWA tiene estrategias de caché (Service Workers) para cargar la interfaz básica, aunque se requiere conexión para pedir viajes.

**P: ¿Es seguro el pago?**
R: La integración está preparada para APIs de Mobile Money (Orange Money, Moov). No almacenamos tarjetas, solo tokens de transacción.

**P: ¿Cómo gestionan la ubicación?**
R: Usamos la API de Geolocalización del navegador (HTML5) enviando coordenadas al backend cada 10 segundos mientras el viaje está activo.

### 6. 📊 Plan de Negocio: Lanzamiento en Bamako
*Detalle financiero para ponerlo en marcha:*

**Modelo Elegido: Suscripción Pura (0% Comisión)**
A diferencia de Uber/Yango que cobran 20-25% por viaje, MotoTX cobra una **cuota fija diaria**. Esto empodera al conductor: "Cuanto más trabajas, más ganas".

#### A. Ganancias del Motorista 🏍️
*Ejemplo Real:*
- **Ingresos**: Realiza 10 viajes al día a un precio medio de **1.000 CFA**.
    - Total Bruto: **10.000 CFA / día**.
- **Gastos**:
    - Gasolina: ~2.000 CFA.
    - Suscripción MotoTX (Pase Diario): **500 CFA**.
- **Ganancia Neta (Bolsillo)**: **7.500 CFA / día**.
    - *Ventaja*: Si hace 20 viajes, sigue pagando solo 500 CFA a la plataforma.

#### B. Ganancias de la Plataforma (MotoTX) 🏢
Nuestros ingresos son recurrentes y predecibles (SaaS):
- **Suscripciones**:
    - Si captamos **100 Motoristas** activos:
    - 100 x 500 CFA = **50.000 CFA / día** (1.500.000 CFA / mes).
- **Cash Flow (Forfaits)**:
    - Clientes compran saldo por adelantado. Tenemos liquidez financiera antes de pagar a los conductores (Settlement semanal).

#### C. Ventaja Competitiva
- **Precio Fijo para el Motorista**: Saben exactamente cuánto pagarán. Sin sorpresas.
- **Transparencia**: El algoritmo no les "roba" porcentaje.
- **Fidelización**: Un conductor con suscripción mensual ("VIP") no se irá a la competencia porque ya ha pagado su mes.

---

### 📝 Notas para el Presentador
- **Ambiente**: Asegúrate de tener el Backend (`php artisan serve`) y el WebSocket (`php artisan reverb:start`) corriendo antes de empezar.
- **Idioma**: La demo está configurada en Español, pero recuerda mostrar el cambio de idioma a Francés/Árabe para impresionar con la localización regional.
