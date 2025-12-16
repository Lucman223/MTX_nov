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

// Debug Route
Route::get('/debug-db', function () {
    return response()->json([
        'default' => config('database.default'),
        'database' => \Illuminate\Support\Facades\DB::connection()->getDatabaseName(),
        'count' => \App\Models\Forfait::count(),
        'path' => base_path('database/database.sqlite'),
        'items' => \App\Models\Forfait::take(5)->get()
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