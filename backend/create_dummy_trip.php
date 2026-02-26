<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Viaje;
use App\Models\User;

$cliente = User::where('rol', 'cliente')->first();
if (!$cliente) {
    $cliente = User::create([
        'name' => 'Cliente Pruebas Dummy',
        'email' => 'dummy_cliente_' . time() . '@test.com',
        'password' => bcrypt('password123'),
        'rol' => 'cliente',
        'telefono' => '12345678'
    ]);
}

$viaje = Viaje::create([
    'cliente_id' => $cliente->id,
    'origen_lat' => 12.6392,
    'origen_lng' => -8.0029,
    'destino_lat' => 12.6500,
    'destino_lng' => -7.9900,
    'origen' => 'Mercado Central Bamako',
    'destino' => 'Estadio Nacional',
    'estado' => 'solicitado',
    'precio' => 1500
]);

echo "Viaje creado EXITOSAMENTE con ID: {$viaje->id}\n";
