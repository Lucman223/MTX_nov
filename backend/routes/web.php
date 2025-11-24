<?php

use Illuminate\Support\Facades\Route;

// This route catches all non-API URIs and serves the React application,
// allowing react-router-dom to handle the frontend routing.
Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '.*');
