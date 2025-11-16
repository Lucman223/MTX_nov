<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForfaitController;
use App\Http\Controllers\ClienteForfaitController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/forfaits', [ForfaitController::class, 'getAvailableForfaits']); // New public route

// Protected routes (JWT required)
Route::group(['middleware' => ['jwt.auth']], function () {
    Route::get('/profile', [AuthController::class, 'getProfile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    Route::post('/forfaits/buy', [ClienteForfaitController::class, 'buyForfait']); // New route for buying forfaits

    // Admin routes
    Route::group(['middleware' => ['admin']], function () {
        Route::apiResource('forfaits', ForfaitController::class);
    });
});
