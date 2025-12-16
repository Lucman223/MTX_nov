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