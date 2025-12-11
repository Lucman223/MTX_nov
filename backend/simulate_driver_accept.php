<?php

use App\Models\User;
use App\Models\Viaje;
use App\Models\MotoristaPerfil;
use App\Services\ViajeService;
use App\Events\ViajeActualizado;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Simulate Driver Accept ---\n";

// 1. Get Motorista
$moto = User::where('email', 'moto@test.com')->first();
$profile = MotoristaPerfil::where('usuario_id', $moto->id)->first();

// Ensure Moto is Active
if ($profile->estado_actual !== 'activo') {
    $profile->update(['estado_actual' => 'activo']);
    echo "Forced Moto to ACTIVO.\n";
}

// 2. Get Trip
// Assuming the latest pending trip
$viaje = Viaje::where('estado', 'solicitado')->latest()->first();

if (!$viaje) {
    echo "No pending trips found to accept.\n";
    exit;
}

echo "Found Trip ID: {$viaje->id}\n";

// 3. Accept Logic (Manual Service Call)
// We mimic ViajeService::acceptTrip
$viaje->update([
    'motorista_id' => $moto->id,
    'estado' => 'aceptado',
]);

// 4. Dispatch Event (Important for Frontend Realtime/Polling)
// Polling checks /api/viajes/actual, so DB update is enough for polling.
// But event is good practice if we had websockets working perfectly.

echo "Trip ID {$viaje->id} ACCEPTED by {$moto->name}.\n";
