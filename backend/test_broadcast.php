<?php
// test_broadcast.php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Events\ViajeSolicitado;
use App\Models\Viaje;
use App\Models\User;

// Create dummy trip for testing
$cliente = User::where('rol', 'cliente')->first();
$viaje = new Viaje();
$viaje->cliente_id = $cliente ? $cliente->id : 1; 
$viaje->origen_lat = 12.6392;
$viaje->origen_lng = -8.0029;
$viaje->destino_lat = 12.6400;
$viaje->destino_lng = -8.0030;
$viaje->estado = 'solicitado';
$viaje->save();

echo "Dispatching ViajeSolicitado event for Trip ID: {$viaje->id}...\n";
ViajeSolicitado::dispatch($viaje);
echo "Event dispatched!\n";
