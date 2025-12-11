<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Viajes\ViajeController;
use App\Http\Controllers\Viajes\RatingController;

Route::middleware('jwt.auth')->group(function () {
    // Trip management
    Route::post('/solicitar', [ViajeController::class, 'solicitarViaje']);
    Route::get('/pendientes', [ViajeController::class, 'getSolicitedTrips']);
    Route::get('/actual', [ViajeController::class, 'getCurrentTrip']);
    Route::post('/{viaje}/aceptar', [ViajeController::class, 'acceptTrip']);
    Route::put('/{viaje}/estado', [ViajeController::class, 'updateTripStatus']);

    // History
    Route::get('/historial', [ViajeController::class, 'getHistory']);
    Route::get('/{id}/detalles', [ViajeController::class, 'getTripDetails']);

    // Ratings
    Route::post('/{id}/calificar', [RatingController::class, 'submitRating']);
    Route::get('/motorista/{motoristaId}/calificaciones', [RatingController::class, 'getMotoristaRatings']);
});
