<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Debug All Data
Route::get('/debug-full', function () {
    return response()->json([
        'users' => [
            'total' => \App\Models\User::count(),
            'admins' => \App\Models\User::where('rol', 'admin')->get(['id', 'name', 'email', 'rol']),
            'clientes' => \App\Models\User::where('rol', 'cliente')->take(5)->get(['id', 'name', 'email', 'rol']),
            'motoristas' => \App\Models\User::where('rol', 'motorista')->take(5)->get(['id', 'name', 'email', 'rol']),
        ],
        'forfaits_catalogo' => \App\Models\Forfait::all(),
        'forfaits_asignados_clientes' => \Illuminate\Support\Facades\DB::table('clientes_forfaits')->take(10)->get(),
        'planes_motorista' => \App\Models\PlanMotorista::all(),
        'suscripciones_motorista' => \Illuminate\Support\Facades\DB::table('suscripciones_motorista')->take(10)->get(),
    ]);
});

/* 
// Debug Routes - Uncomment for Demo Data Generation
Route::get('/debug/create-trip', function() {
    $motoristas = \App\Models\User::where('rol', 'motorista')->latest()->take(10)->get();
    $c = \App\Models\User::where('rol', 'cliente')->latest()->first();
    
    if($motoristas->count() > 0 && $c) {
        foreach($motoristas as $m) {
            \App\Models\Viaje::create([
                'cliente_id' => $c->id,
                'motorista_id' => $m->id,
                'estado' => 'completado',
                'origen_lat' => 12.6392, 'origen_lng' => -8.0029, 'destino_lat' => 12.6450, 'destino_lng' => -7.9950,
                'fecha_solicitud' => now(),
                'fecha_fin' => now(),
                'updated_at' => now()
            ]);
        }
        return 'Trips Created for ' . $motoristas->count() . ' drivers';
    }
    return 'Users Not Found';
});
*/

// Include segregated API routes
Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', [\App\Http\Controllers\Auth\AuthController::class, 'register']);
    Route::post('/login', [\App\Http\Controllers\Auth\AuthController::class, 'login']);
    
    Route::group(['middleware' => ['jwt.auth']], function () {
        Route::get('/profile', [\App\Http\Controllers\Auth\AuthController::class, 'getProfile']);
        Route::put('/profile', [\App\Http\Controllers\Auth\AuthController::class, 'updateProfile']);
    });
});
Route::group(['prefix' => 'viajes'], function () {
    require __DIR__.'/api/viajes.php';
});
require __DIR__.'/api/pagos.php';

// Debug public route for plans
Route::get('/debug/planes', function () {
    return \App\Models\PlanMotorista::all();
});

Route::group(['middleware' => ['jwt.auth']], function () {
    require __DIR__.'/api/user.php'; // Motorista specific routes, already has 'motorista' middleware inside
    
    // Motorista Subscription Routes (Protected by JWT, but specific role check inside controller/middleware)
    Route::group(['middleware' => ['motorista'], 'prefix' => 'motorista/planes'], function () {
        Route::get('/', [\App\Http\Controllers\Pagos\MotoristaPlanController::class, 'index'])->name('motorista.planes.index');
        Route::get('/status', [\App\Http\Controllers\Pagos\MotoristaPlanController::class, 'getStatus'])->name('motorista.planes.status');
        Route::post('/subscribe', [\App\Http\Controllers\Pagos\MotoristaPlanController::class, 'subscribe'])->name('motorista.planes.subscribe');
    });
    require __DIR__.'/api/admin.php'; // Admin specific routes, already has 'admin' middleware inside
});

// Ruta de emergencia para inicializar la base de datos en producción
Route::get('/init-db', function() {
    try {
        Artisan::call('migrate:fresh', ['--force' => true, '--seed' => true]);
        
        $admin = \App\Models\User::where('email', 'admin@mototx.com')->first();
        $check = $admin ? \Illuminate\Support\Facades\Hash::check('password', $admin->password) : false;
        
        return response()->json([
            'message' => 'Base de datos inicializada correctamente con usuarios de prueba.',
            'admin_verified' => $check,
            'hash_sample' => $admin ? $admin->password : null,
            'output' => Artisan::output()
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});