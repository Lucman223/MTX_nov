<?php

use Illuminate\Support\Facades\Route;

// Debug Route
Route::get('/test-debug', function () {
    return 'SERVER IS ALIVE ' . date('Y-m-d H:i:s');
});

// This route catches all non-API URIs and serves the React application,
// allowing react-router-dom to handle the frontend routing.
// PWA Routes: Serve build assets from root to fix Scope
Route::get('/sw.js', function () {
    $path = public_path('build/sw.js');
    if (!file_exists($path)) {
        // Fallback for dev mode purely or if build missing
        return response('Service Worker not found. Run npm run build.', 404);
    }
    return response()->file($path, [
        'Content-Type' => 'application/javascript',
        'Service-Worker-Allowed' => '/'
    ]);
});

Route::get('/manifest.webmanifest', function () {
    $path = public_path('build/manifest.webmanifest');
    if (!file_exists($path)) {
        return response('Manifest not found. Run npm run build.', 404);
    }
    return response()->file($path, [
        'Content-Type' => 'application/manifest+json'
    ]);
});

Route::get('/debug-data', function () {
    $user = \App\Models\User::where('email', 'moto@mototx.com')->first();
    $perfil = $user ? \App\Models\MotoristaPerfil::where('usuario_id', $user->id)->first() : null;
    $planes = \App\Models\PlanMotorista::all();

    return response()->json([
        'user_exists' => !!$user,
        'perfil_exists' => !!$perfil,
        'viajes_perfil' => $perfil ? $perfil->viajes_prueba_restantes : 'N/A',
        'planes_count' => $planes->count(),
        'planes' => $planes
    ]);
});

// Debug Config Route (Temporary)
// Route::get('/debug-config', function () {
//     return response()->json([
//         'sanctum_stateful' => config('sanctum.stateful'),
//         'session_domain' => config('session.domain'),
//         'app_url' => config('app.url'),
//     ]);
// });

// EMERGENCIA: Resetear Password y Cache
// Route::get('/debug-reset-pass', function() {
//     try {
//         Artisan::call('optimize:clear'); // Force clear cache
        
//         $user = \App\Models\User::where('email', 'cliente@mototx.com')->first();
//         if($user) {
//             $user->password = '123456'; 
//             $user->save();
//             return 'EXITO: Cache borrada y Password de cliente@mototx.com reseteada a: 123456';
//         }
//         return 'ERROR: Usuario no encontrado. Ve a /debug-init-db para crearlos.';
//     } catch (\Exception $e) {
//         return 'ERROR SISTEMA: ' . $e->getMessage();
//     }
// });

// ULTIMO RECURSO: Recrear Base de Datos
// Route::get('/debug-init-db', function() {
//     try {
//         // Aumentar tiempo de ejecución para migraciones lentas
//         set_time_limit(300);
        
//         Artisan::call('migrate:fresh', [
//             '--force' => true,
//             '--seed' => true
//         ]);
        
//         return 'EXITO TOTAL: Base de datos recreada y semillas ejecutadas. Usuario: cliente@mototx.com / password';
//     } catch (\Exception $e) {
//         return 'ERROR CRITICO DB: ' . $e->getMessage();
//     }
// });

// Admin Reports Route
Route::get('/reports/monthly', [\App\Http\Controllers\Admin\ReportController::class, 'generateMonthlyReport']);

Route::get('/generar-test', function () {
    $m = App\Models\User::updateOrCreate(
        ['email' => 'moto_test@mtx.com'],
        ['name'=>'Piloto','password'=>bcrypt('password123'),'rol'=>'motorista','telefono'=>'10002000','status'=>'aprobado']
    );
    App\Models\MotoristaPerfil::updateOrCreate(
        ['usuario_id' => $m->id],
        ['marca_vehiculo'=>'H','matricula'=>'T1','documento_licencia_path'=>'d','estado_actual'=>'activo','estado_validacion'=>'aprobado','billetera'=>5000,'viajes_prueba_restantes'=>10]
    );
    
    $c = App\Models\User::updateOrCreate(
        ['email' => 'cliente_test@mtx.com'],
        ['name'=>'Pasajero', 'password'=>bcrypt('password123'),'rol'=>'cliente','telefono'=>'30004000','status'=>'aprobado']
    );
    App\Models\ClienteForfait::updateOrCreate(
        ['cliente_id' => $c->id],
        ['forfait_id'=>1,'viajes_restantes'=>100,'fecha_compra'=>now(),'fecha_expiracion'=>now()->addYear(),'estado'=>'activo']
    );

    return "Cuentas Listas! - Moto: moto_test@mtx.com | Cliente: cliente_test@mtx.com (Pass: password123)";
});

Route::get('/instalar-base-de-datos', function () {
    try {
        // Aumentar el tiempo límite e ignorar restricciones para migraciones pesadas
        set_time_limit(300);
        
        \Illuminate\Support\Facades\Artisan::call('migrate:fresh', [
            '--force' => true,
            '--seed' => true
        ]);
        return "¡Base de datos Aiven instalada y lista con éxito!";
    } catch (\Exception $e) {
        return "ERROR AL INSTALAR: " . $e->getMessage() . " -- Verifica que los credenciales DB_ en Koyeb estén bien copiados.";
    }
});

Route::get('/ver-errores', function () {
    $logFile = storage_path('logs/laravel.log');
    if (!file_exists($logFile)) {
        return "No hay errores registrados.";
    }
    // Read the last 5000 bytes of the log file
    $content = file_get_contents($logFile, false, null, max(0, filesize($logFile) - 5000));
    return response("<pre>" . htmlspecialchars($content) . "</pre>")->header('Content-Type', 'text/html');
});

// React App Catch-all (exclude API and PWA files)
Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '^(?!api|sw.js|manifest.webmanifest|build).*$');

