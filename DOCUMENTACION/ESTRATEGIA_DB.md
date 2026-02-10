# 🗄️ Estrategia de Presentación: Base de Datos (XAMPP)

Como estás usando XAMPP, la forma más visual y profesional de mostrar la base de datos es a través de **phpMyAdmin** o un cliente SQL externo (como DBeaver, HeidiSQL o TablePlus).

Aquí tienes el plan para mostrarlo durante la demo:

## 1. Preparación (Antes de la Demo)

Asegúrate de tener datos "bonitos" en la base de datos.
-   **Usuarios de prueba:** Crea al menos 5 motoristas y 5 clientes con nombres reales (no "asd asd").
-   **Viajes recientes:** Asegúrate de tener viajes con fecha de "hoy" para que las estadísticas del Admin Dashboard no salgan vacías.

## 2. Cómo Mostrarlo (El "Flow")

Cuando los jueces pregunten "apriétame la tuerca" o quieran ver la persistencia de datos:

1.  **Abre phpMyAdmin:**
    -   URL: `http://localhost/phpmyadmin`
    -   Selecciona la base de datos `mototx` (o el nombre que tengas en `.env`).

2.  **Tablas Clave a Mostrar:**
    No muestres todas, céntrate en las que demuestran la lógica de negocio:

    *   **`users`**:
        *   Muestra la columna `rol` para evidenciar la seguridad (admin vs motorista vs cliente).
        *   *Narrativa:* "Aquí centralizamos la autenticación. Observen cómo segmentamos los roles."

    *   **`motorista_perfils`**:
        *   Esta es tu tabla "estrella". Muestra columnas `estado_actual` (activo/inactivo) y `licencia`.
        *   *Narrativa:* "Aquí almacenamos la información sensible del conductor, separada del usuario base para cumplir con normas de privacidad."

    *   **`viajes`**:
        *   Ordena por `id` descendente para mostrar el último viaje que acabas de hacer en la demo.
        *   *Narrativa:* "Cada viaje queda registrado inmutablemente con sus coordenadas y estados para auditoría."

    *   **`forfaits`**:
        *   Muestra los paquetes disponibles (Urban, Suburban, Cross-Country).
        *   *Narrativa:* "Aquí definimos los productos comerciales. Podemos crear nuevos packs sin tocar código."

    *   **`planes_motorista`**:
        *   Muestra las suscripciones de los conductores (Semanal, Mensual).
        *   *Narrativa:* "Modelo de negocio flexible para los socios conductores."

    *   **`transacciones`**:
        *   Si hay pagos, aquí se ven los IDs de Orange Money.
        *   *Narrativa:* "Traza financiera completa de cada céntimo que entra."

## 3. Script de Reset (Plan B)

Si en medio de la demo la base de datos se ensucia mucho, ten listo este comando en tu terminal para reiniciarla a un estado limpio y perfecto:

```powershell
php artisan migrate:fresh --seed
```

*(Asegúrate de que tus Seeders estén configurados con datos de prueba realistas).*

## 4. Verificación Rápida

Antes de empezar, corre esto en tu terminal para ver si todo conecta bien:

```powershell
php artisan db:monitor
```
(Si sale "OK", estás listo).
