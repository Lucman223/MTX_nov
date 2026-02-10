<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Pagos\ForfaitController; // Forfaits are managed by admin

Route::group(['middleware' => ['jwt.auth', 'admin'], 'prefix' => 'admin'], function () {
    Route::apiResource('forfaits', ForfaitController::class);
    Route::apiResource('users', AdminController::class)->except(['store']);
    Route::put('/motoristas/{user}/status', [AdminController::class, 'updateMotoristaStatus']);
    Route::get('/viajes', [AdminController::class, 'getAllTrips']);
    Route::get('/transacciones', [AdminController::class, 'getAllTransacciones']);
    Route::get('/statistics', [AdminController::class, 'getStatistics']);
    Route::get('/chart-data', [AdminController::class, 'getChartData']);
    Route::get('/reports/export', [\App\Http\Controllers\Admin\AdminReportController::class, 'exportMonthlyReport']);
});
