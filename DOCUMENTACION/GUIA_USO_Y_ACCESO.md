# Guía de Uso y Acceso - MotoTX

Este documento explica cómo acceder a la plataforma, crear nuevos usuarios y poner en marcha el sistema tanto en PC como en móviles.

## 1. Gestión de Usuarios y Credenciales

### Acceso Rápido
Para pruebas rápidas, consulta el archivo `CREDENCIALES_ACCESO.txt` en esta misma carpeta, donde encontrarás cuentas pre-creadas para Admin, Cliente y Motorista (Password común: `123456`).

### Crear Nuevos Usuarios

#### Opción A: Registro desde la Web (Normal)
1. Ve a la página de inicio (Login).
2. Haz clic en **"Registrarse"**.
3. Rellena el formulario seleccionando si eres **Cliente** o **Motorista**.
4. *Nota*: Los motoristas requieren aprobación del Admin antes de poder aceptar viajes.

#### Opción B: Crear Usuarios Manualmente (Vía Terminal)
Útil para crear **Administradores** o usuarios de prueba rápidamente sin pasar por el formulario.

1. Abre una terminal en la carpeta `backend`.
2. Ejecuta la consola interactiva de Laravel:
   ```bash
   php artisan tinker
   ```
3. Pega el siguiente código (modificando los datos según necesites):
   ```php
   // Crear un ADMIN
   User::create([
       'name' => 'Admin Nuevo',
       'email' => 'admin2@test.com',
       'password' => Hash::make('123456'),
       'rol' => 'admin',
       'telefono' => '99999999'
   ]);

   // Crear un MOTORISTA ya validado
   $user = User::create([
       'name' => 'Moto Test',
       'email' => 'moto_test@test.com',
       'password' => Hash::make('123456'),
       'rol' => 'motorista',
       'telefono' => '88888888'
   ]);
   MotoristaPerfil::create([
       'usuario_id' => $user->id,
       'estado_validacion' => 'aprobado',
       'estado_actual' => 'activo'
   ]);
   ```
4. Escribe `exit` para salir.

---

## 2. Puesta en Marcha de la Plataforma

Las instrucciones técnicas detalladas están en el archivo **`README.md`**, sección "Ejecutar la Aplicación". Aquí tienes el resumen práctico:

### Modo PC (Navegador Local)
Necesitas **dos terminales** abiertas:

**Terminal 1 (Backend):**
```bash
cd backend
php artisan serve
```

**Terminal 2 (Frontend):**
```bash
cd backend
npm run dev
```

> **Acceso:** Abre `http://localhost:8000` en tu navegador.

### Modo Móvil (Pruebas en Red Local)
Para probar desde tu teléfono conectado a la misma red Wi-Fi:

1. **Averigua tu IP local**: Ejecuta `ipconfig` (Windows) y busca la "Dirección IPv4" (ej. `192.168.1.50`).

2. **Terminal 1 (Backend)** - Exponer a la red:
   ```bash
   cd backend
   php artisan serve --host=0.0.0.0
   ```

3. **Terminal 2 (Frontend)** - Exponer a la red:
   ```bash
   cd backend
   npm run dev -- --host
   ```

4. **Configuración API Frontend**:
   Asegúrate de que el frontend apunte a tu IP.
   > **Nota Importante:** Si el frontend intenta conectar a `localhost`, no funcionará en el móvil. Debes asegurarte de que `VITE_API_BASE_URL` en tu archivo `.env` del frontend (o donde esté configurado Axios) apunte a `http://TU_IP:8000/api`.

> **Acceso:** Abre el navegador de tu móvil y entra a `http://TU_IP:5173` (o el puerto que te indique `npm run dev`).
