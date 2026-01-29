<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Debug All Data
Route::get('/debug-full', function () {
    return response()->json([
        'db_connection' => config('database.default'),
        'db_database' => env('DB_DATABASE'),
        'users' => [
            'total' => \App\Models\User::count(),
            'admins' => \App\Models\User::where('rol', 'admin')->get(['id', 'name', 'email', 'rol']),
            'clientes' => \App\Models\User::where('rol', 'cliente')->take(5)->get(['id', 'name', 'email', 'rol']),
            'motoristas' => \App\Models\User::where('rol', 'motorista')->take(5)->get(['id', 'name', 'email', 'rol']),
        ],
        'forfaits_catalogo' => \App\Models\Forfait::all(),
    ]);
});

// Segmented API routes
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

Route::group(['middleware' => ['jwt.auth']], function () {
    require __DIR__.'/api/user.php';
    
    Route::group(['middleware' => ['motorista'], 'prefix' => 'motorista/planes'], function () {
        Route::get('/', [\App\Http\Controllers\Pagos\MotoristaPlanController::class, 'index']);
        Route::get('/status', [\App\Http\Controllers\Pagos\MotoristaPlanController::class, 'getStatus']);
        Route::post('/subscribe', [\App\Http\Controllers\Pagos\MotoristaPlanController::class, 'subscribe']);
    });
    require __DIR__.'/api/admin.php';
});

// EMERGENCY ROUTES
Route::get('/init-db', function() {
    try {
        Artisan::call('migrate:fresh', ['--force' => true, '--seed' => true]);
        $output = Artisan::output();
        return response()->json([
            'status' => 'success',
            'message' => 'Base de datos inicializada correctamente.',
            'artisan_output' => $output,
            'users_created' => \App\Models\User::count()
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

Route::get('/debug-auth-check', function() {
    $results = [];
    $users = \App\Models\User::withTrashed()->whereIn('email', ['admin@mototx.com', 'cliente@mototx.com', 'moto@mototx.com'])->get();
    
    foreach($users as $user) {
        $pass = ($user->email == 'moto@mototx.com') ? 'password123' : 'password';
        $results[$user->email] = [
            'rol' => $user->rol,
            'is_deleted' => $user->trashed(),
            'check_password' => \Illuminate\Support\Facades\Hash::check($pass, $user->password),
            'hash_prefix' => substr($user->password, 0, 8)
        ];
    }
    
    return response()->json([
        'status' => 'ok',
        'db' => config('database.default'),
        'total_real_users' => \App\Models\User::withTrashed()->count(),
        'checks' => $results
    ]);
});