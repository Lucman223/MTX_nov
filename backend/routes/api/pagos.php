<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Pagos\ForfaitController;
use App\Http\Controllers\Pagos\ClienteForfaitController;
use App\Http\Controllers\Pagos\PaymentController;

Route::get('/forfaits/disponibles', [ForfaitController::class, 'getAvailableForfaits']); // New public route
// Route::post('/orange-money/callback', [OrangeMoneyController::class, 'handleCallback']); // Deprecated

Route::group(['middleware' => ['jwt.auth']], function () {
    Route::post('/forfaits/buy', [ClienteForfaitController::class, 'buyForfait']);
    
    // Rutas de pagos (Simulación)
    Route::post('/pagos/iniciar', [PaymentController::class, 'initiatePayment']);
    Route::post('/pagos/verificar', [PaymentController::class, 'verifyPayment']);
});
