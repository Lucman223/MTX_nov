<?php

use App\Models\User;
use App\Models\Viaje;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- MotoTX Trip Simulator ---\n";

// 1. Find a Client
$cliente = User::where('rol', 'cliente')->first();

if (!$cliente) {
    echo "Creating demo client...\n";
    $cliente = User::create([
        'name' => 'Cliente Demo',
        'email' => 'clientedemo@test.com',
        'password' => bcrypt('password'),
        'rol' => 'cliente'
    ]);
}

echo "Client: {$cliente->name} (ID: {$cliente->id})\n";

// 2. Create Pending Trip
echo "Creating pending trip...\n";

$viaje = Viaje::create([
    'cliente_id' => $cliente->id,
    'origen_lat' => 12.6392, // Bamako coords approx
    'origen_lng' => -8.0029,
    'destino_lat' => 12.6500,
    'destino_lng' => -7.9900,
    'estado' => 'solicitado',
    'fecha_solicitud' => now(),
]);

echo "Trip Created Successfully!\n";
echo "ID: {$viaje->id}\n";
echo "Status: {$viaje->estado}\n";
echo "--------------------------\n";
echo "Check Driver Dashboard NOW.\n";
