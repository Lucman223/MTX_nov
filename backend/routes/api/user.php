<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\MotoristaController;
use App\Http\Controllers\Viajes\ViajeController; // Also needed for motorista's trip actions

Route::group(['middleware' => ['jwt.auth', 'motorista']], function () {
    Route::put('/motorista/status', [MotoristaController::class, 'updateStatus']);
    Route::put('/motorista/ubicacion', [MotoristaController::class, 'updateLocation']);
    Route::get('/motorista/viajes/solicitados', [ViajeController::class, 'getSolicitedTrips']);
    Route::post('/motorista/viajes/{viaje}/aceptar', [ViajeController::class, 'acceptTrip']);
    Route::put('/motorista/viajes/{viaje}/status', [ViajeController::class, 'updateTripStatus']);
    Route::get('/motorista/stats', [ViajeController::class, 'getDriverStats']);
    Route::get('/motorista/perfil', [MotoristaController::class, 'getProfile']);
    Route::post('/motorista/retirar', [MotoristaController::class, 'withdraw']);
    Route::get('/motorista/transacciones', [MotoristaController::class, 'getTransactions']);
    Route::put('/motorista/perfil', [MotoristaController::class, 'updateMotoristaProfile']);
});

Route::group(['middleware' => ['jwt.auth']], function () {
    Route::delete('/profile', [\App\Http\Controllers\Auth\AuthController::class, 'deleteAccount']);
});
