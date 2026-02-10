<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Main API Routes
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