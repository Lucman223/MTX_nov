<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Pagos\ClienteForfaitController;

Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'forfaits'], function() {
    // List available forfaits
    Route::get('/disponibles', [ClienteForfaitController::class, 'index']);
    
    // Purchase flow
    Route::post('/buy', [ClienteForfaitController::class, 'buyForfait']);
    
    // Check Status (Polling)
    Route::post('/check-status', [ClienteForfaitController::class, 'checkStatus']);
});

// Public access for Landing Page Showcase
Route::get('/public', [ClienteForfaitController::class, 'index']);
