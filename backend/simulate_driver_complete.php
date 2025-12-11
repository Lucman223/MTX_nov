<?php

use App\Models\User;
use App\Models\Viaje;
use App\Models\MotoristaPerfil;
use App\Events\ViajeActualizado;
use Carbon\Carbon;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Simulate Driver Complete ---\n";

// 1. Get Trip (Accepted/En Curso)
$viaje = Viaje::whereIn('estado', ['aceptado', 'en_curso'])->latest()->first();

if (!$viaje) {
    echo "No active trip found.\n";
    exit;
}

echo "Found Trip ID: {$viaje->id} (Status: {$viaje->estado})\n";

// 2. Complete it
$viaje->update([
    'estado' => 'completado',
    'fecha_fin' => Carbon::now()
]);

// 3. Dispatch Event
// Using the event class directly. Ideally should mimic ViajeService logic but this is fine for test.
// Note: ViajeActualizado constructor might expect just the model.
try {
    echo "Dispatching ViajeActualizado event...\n";
    ViajeActualizado::dispatch($viaje);
} catch (\Exception $e) {
    echo "Event dispatch failed: " . $e->getMessage() . "\n";
}

echo "Trip ID {$viaje->id} COMPLETED.\n";
