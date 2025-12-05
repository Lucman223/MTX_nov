<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Pagos\ForfaitController; // Forfaits are managed by admin

Route::group(['middleware' => ['jwt.auth', 'admin']], function () {
    Route::apiResource('forfaits', ForfaitController::class);
    Route::apiResource('users', AdminController::class)->except(['store']);
    Route::put('/admin/motoristas/{user}/status', [AdminController::class, 'updateMotoristaStatus']);
    Route::get('/admin/viajes', [AdminController::class, 'getAllTrips']);
    Route::get('/admin/transacciones', [AdminController::class, 'getAllTransacciones']);
});
