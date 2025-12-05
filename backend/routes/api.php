<?php

use Illuminate\Support\Facades\Route;

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

// Include segregated API routes
require __DIR__.'/api/auth.php';
require __DIR__.'/api/pagos.php';
require __DIR__.'/api/viajes.php';

// Protected routes (JWT required) - these will wrap the user and admin specific routes
Route::group(['middleware' => ['jwt.auth']], function () {
    require __DIR__.'/api/user.php'; // Motorista specific routes, already has 'motorista' middleware inside
    require __DIR__.'/api/admin.php'; // Admin specific routes, already has 'admin' middleware inside
});