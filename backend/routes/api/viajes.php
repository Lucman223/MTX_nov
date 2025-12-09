<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Viajes\ViajeController;
use App\Http\Controllers\Viajes\CalificacionController;

Route::group(['middleware' => ['jwt.auth']], function () {
    Route::post('/viajes/solicitar', [ViajeController::class, 'solicitarViaje']);
    Route::get('/viajes/pendientes', [ViajeController::class, 'getSolicitedTrips']);
    Route::get('/viajes/actual', [ViajeController::class, 'getCurrentTrip']); // New
    Route::post('/viajes/{viaje}/aceptar', [ViajeController::class, 'acceptTrip']);
    Route::post('/viajes/{viaje}/estado', [ViajeController::class, 'updateTripStatus']); // New

    Route::post('/calificaciones/motorista/{viaje}', [CalificacionController::class, 'rateMotorista']);
    Route::post('/calificaciones/cliente/{viaje}', [CalificacionController::class, 'rateCliente']);
});
