<?php

use Illuminate\Support\Facades\Route;

// Debug Route
Route::get('/test-debug', function () {
    return 'SERVER IS ALIVE ' . date('Y-m-d H:i:s');
});

// This route catches all non-API URIs and serves the React application,
// allowing react-router-dom to handle the frontend routing.
// PWA Routes: Serve build assets from root to fix Scope
Route::get('/sw.js', function () {
    $path = public_path('build/sw.js');
    if (!file_exists($path)) {
        // Fallback for dev mode purely or if build missing
        return response('Service Worker not found. Run npm run build.', 404);
    }
    return response()->file($path, [
        'Content-Type' => 'application/javascript',
        'Service-Worker-Allowed' => '/'
    ]);
});

Route::get('/manifest.webmanifest', function () {
    $path = public_path('build/manifest.webmanifest');
    if (!file_exists($path)) {
        return response('Manifest not found. Run npm run build.', 404);
    }
    return response()->file($path, [
        'Content-Type' => 'application/manifest+json'
    ]);
});

// React App Catch-all (exclude API and PWA files)
Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '^(?!api|sw.js|manifest.webmanifest|build).*$');
