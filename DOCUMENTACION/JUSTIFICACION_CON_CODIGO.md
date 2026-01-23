# 🧠 Justificación Técnica Profunda (Con Código) - MotoTX

Este documento vincula las decisiones arquitectónicas directamente con el código fuente implementado.

---

## 1. Patrón de Diseño: Service Pattern

### 📄 Código Evidencia: `app/Services/MotoristaService.php`

```php
class MotoristaService
{
    // ...
    public function updateLocation(User $user, float $latitude, float $longitude): MotoristaPerfil
    {
        $motoristaPerfil = MotoristaPerfil::where('usuario_id', $user->id)->firstOrFail();
        $motoristaPerfil->update([
            'latitud_actual' => $latitude,
            'longitud_actual' => $longitude,
        ]);
        
        // Evento disparado para WebSockets
        event(new MotoristaLocationUpdated($motoristaPerfil));
        
        return $motoristaPerfil;
    }
}
```

### ❓ ¿Por qué existe este código?
Para encapsular la lógica de actualización de posición. Observa que no solo actualiza la base de datos (`update`), sino que también dispara un evento (`event(new MotoristaLocationUpdated)`).

### 🛡️ ¿Qué problema resuelve?
Si esto estuviera en el Controlador (`RideController`), tendríamos que duplicar estas 10 líneas cada vez que queramos actualizar la ubicación desde diferentes puntos (API, Consola, Test). Aquí está centralizado. Si mañana queremos enviar un SMS al actualizar la ubicación, solo cambiamos este archivo.

### ⚠️ Consecuencias
La consecuencia positiva es que el Controlador solo llama a `$this->motoristaService->updateLocation(...)`, manteniendo la capa HTTP limpia y enfocada solo en recibir la petición y responder JSON.

---

## 2. Autenticación Stateless con JWT

### 📄 Código Evidencia: `app/Http/Controllers/Auth/AuthController.php`

```php
public function login(Request $request)
{
    $credentials = $request->only('email', 'password');

    try {
        // Intentamos generar el token SIN crear una sesión en servidor
        if (! $token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
    } catch (JWTException $e) {
        return response()->json(['error' => 'Could not create token'], 500);
    }

    // Devolvemos el token al cliente
    return response()->json([
        'access_token' => $token,
        'token_type' => 'bearer',
        'expires_in' => JWTAuth::factory()->getTTL() * 60,
        // ...
    ]);
}
```

### ❓ ¿Por qué existe este código?
Usamos `JWTAuth::attempt($credentials)` en lugar de `Auth::attempt()`. Esto genera una cadena cifrada (Token) que contiene la identidad del usuario.

### 🛡️ ¿Qué problema resuelve?
Resuelve la dependencia de cookies y sesiones de servidor. Las Apps móviles (Android/iOS) y otros servicios externos pueden consumir esta API simplemente enviando el token en la cabecera `Authorization: Bearer <token>`, sin necesidad de gestionar cookies complejas.

### ⚠️ Consecuencias
El backend no guarda nada sobre la sesión. Si el servidor se reinicia, los usuarios siguen logueados porque el token vive en el cliente (localStorage/SecureStorage).

---

## 3. Seguridad por Capas (Middleware)

### 📄 Código Evidencia: `app/Http/Middleware/MotoristaMiddleware.php`

```php
public function handle(Request $request, Closure $next): Response
{
    // ... validación de token ...

    // Bloqueo explícito por Rol
    if ($user->rol !== 'motorista') {
        return response()->json(['error' => 'Forbidden: Motorista role required'], 403);
    }

    // Bloqueo por Suscripción (Lógica de Negocio en Middleware)
    $perfil = \App\Models\MotoristaPerfil::where('usuario_id', $user->id)->first();
    
    // Si no tiene acceso (suscripción caducada) y no está yendo a pagar...
    if ($perfil && !$perfil->hasAccess() && !in_array($route, $allowedRoutes)) {
         return response()->json(['error' => 'Subscription required'], 403);
    }

    return $next($request);
}
```

### ❓ ¿Por qué existe este código?
Es un "guardián" que se ejecuta **antes** que cualquier código del controlador. Verifica rol y estado de suscripción.

### 🛡️ ¿Qué problema resuelve?
Evita que un hacker o un usuario malintencionado acceda a funciones de motorista simplemente adivinando la URL (`/api/viajes/aceptar`). Si no pasa este filtro, el código del controlador nunca se ejecuta.

### ⚠️ Consecuencias
Centraliza la seguridad. Si cambiamos las reglas de suscripción, solo tocamos este archivo y se protege toda la API de motoristas instantáneamente.

---

## 4. Tiempo Real (WebSockets Privados)

### 📄 Código Evidencia: `routes/channels.php`

```php
Broadcast::channel('viaje.{viajeId}', function ($user, $viajeId) {
    $viaje = Viaje::find($viajeId);

    // Solo el cliente y el motorista asignados pueden "escuchar" este viaje
    return $user->id === $viaje->cliente_id || $user->id === $viaje->motorista_id;
});
```

### ❓ ¿Por qué existe este código?
Define reglas de autorización para los canales de escucha en tiempo real.

### 🛡️ ¿Qué problema resuelve?
Privacidad. Sin esto, cualquier usuario podría escuchar el canal `viaje.1` y ver las coordenadas en tiempo real de otro usuario. Este código asegura que solo los participantes legítimos reciban los datos.

### ⚠️ Consecuencias
Garantiza que la comunicación en tiempo real sea segura y privada, cumpliendo con normativas de protección de datos.

---

## 5. Estrategia Offline First (Service Worker PWA)

### 📄 Código Evidencia: `resources/js/sw.js`

```javascript
// Cache API calls (Offline Mode)
registerRoute(
    ({ url }) => url.pathname.includes('/api/viajes/historial'),
    new StaleWhileRevalidate({
        cacheName: 'api-data-cache',
        plugins: [
            new ExpirationPlugin({ maxEntries: 50 }),
        ],
    })
);

// Push Notifications Listener
self.addEventListener('push', (event) => {
    // ... logic to parse and show notification ...
    self.registration.showNotification(data.title, options);
});
```

### ❓ ¿Por qué existe este código?
Implementamos un **Service Worker** personalizado usando Workbox. Interceptamos las peticiones de red.

### 🛡️ ¿Qué problema resuelve?
Permite que la aplicación funcione en zonas de baja conectividad (Bamako). Si se va el internet, el usuario aún puede ver su historial de viajes (servido desde cache con la estrategia `StaleWhileRevalidate`) y mapas cacheados. Además, habilita notificaciones push nativas.

### ⚠️ Consecuencias
Mejora drásticamente la UX percibida y la resiliencia de la aplicación.

---

## 6. Diseño de Base de Datos (Single Table Inheritance)

### 📄 Código Evidencia: `app/Models/User.php`

```php
class User extends Authenticatable implements JWTSubject
{
    protected $fillable = [
        'name',
        'email',
        'password',
        'rol', // <--- La clave de todo
    ];

    // Relación específica para motoristas
    public function motorista_perfil()
    {
        return $this->hasOne(MotoristaPerfil::class, 'usuario_id');
    }
}
```

### ❓ ¿Por qué existe este código?
Tenemos un solo modelo `User` con un campo `rol`, y una relación `hasOne` hacia `MotoristaPerfil` para los datos extra.

### 🛡️ ¿Qué problema resuelve?
Evita tener tablas duplicadas de autenticación (`mesas_login`, `clientes_login`). Todos son `Users`. Esto simplifica el Login (`AuthController` es único) y el registro.

### ⚠️ Consecuencias
Si un usuario es 'cliente', la relación `motorista_perfil` será `null`. El código debe estar preparado para manejar esto (como usamos `?->` operador null-safe en PHP).
