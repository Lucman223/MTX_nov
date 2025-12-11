<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Viaje;
use App\Models\ClienteForfait;
use App\Models\Forfait;

echo "=== Creando viajes completados para pruebas ===\n\n";

// Get users
$cliente = User::where('email', 'client@test.com')->first();
$motorista = User::where('email', 'amadou@test.com')->first();

if (!$cliente || !$motorista) {
    echo "❌ Error: Usuarios no encontrados. Asegúrate de que existan client@test.com y amadou@test.com\n";
    exit(1);
}

// Create 3 completed trips
echo "Creando viajes completados...\n";

$trips = [
    [
        'origen_lat' => 12.6392,
        'origen_lng' => -8.0029,
        'destino_lat' => 12.6500,
        'destino_lng' => -8.0100,
        'created_at' => now()->subDays(5),
    ],
    [
        'origen_lat' => 12.6450,
        'origen_lng' => -8.0050,
        'destino_lat' => 12.6550,
        'destino_lng' => -8.0150,
        'created_at' => now()->subDays(3),
    ],
    [
        'origen_lat' => 12.6400,
        'origen_lng' => -8.0080,
        'destino_lat' => 12.6600,
        'destino_lng' => -8.0200,
        'created_at' => now()->subDays(1),
    ],
];

foreach ($trips as $index => $tripData) {
    $viaje = Viaje::create([
        'cliente_id' => $cliente->id,
        'motorista_id' => $motorista->id,
        'origen_lat' => $tripData['origen_lat'],
        'origen_lng' => $tripData['origen_lng'],
        'destino_lat' => $tripData['destino_lat'],
        'destino_lng' => $tripData['destino_lng'],
        'estado' => 'completado',
        'created_at' => $tripData['created_at'],
        'updated_at' => $tripData['created_at']->addMinutes(15),
    ]);

    echo "✅ Viaje #" . ($index + 1) . " creado (ID: {$viaje->id})\n";
}

echo "\n=== ✅ Proceso completado ===\n";
echo "Se crearon 3 viajes completados.\n";
echo "Ahora puedes:\n";
echo "1. Login como cliente (client@test.com / password)\n";
echo "2. Ir a Dashboard → Click en '📋 Historial'\n";
echo "3. Calificar los viajes\n";
echo "4. Login como motorista (amadou@test.com / password)\n";
echo "5. Ver las calificaciones recibidas en su historial\n";
