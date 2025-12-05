<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Pagos\ForfaitController;
use App\Http\Controllers\Pagos\ClienteForfaitController;
use App\Http\Controllers\Pagos\OrangeMoneyController;

Route::get('/forfaits', [ForfaitController::class, 'getAvailableForfaits']); // New public route
Route::post('/orange-money/callback', [OrangeMoneyController::class, 'handleCallback']); // Orange Money Callback (Public)

Route::group(['middleware' => ['jwt.auth']], function () {
    Route::post('/forfaits/buy', [ClienteForfaitController::class, 'buyForfait']);
    Route::post('/orange-money/initiate', [OrangeMoneyController::class, 'initiatePayment']);
});
