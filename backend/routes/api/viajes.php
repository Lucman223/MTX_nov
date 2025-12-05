<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Viajes\ViajeController;
use App\Http\Controllers\Viajes\CalificacionController;

Route::group(['middleware' => ['jwt.auth']], function () {
    Route::post('/viajes/solicitar', [ViajeController::class, 'solicitarViaje']);
    Route::post('/calificaciones/motorista/{viaje}', [CalificacionController::class, 'rateMotorista']);
    Route::post('/calificaciones/cliente/{viaje}', [CalificacionController::class, 'rateCliente']);
});
