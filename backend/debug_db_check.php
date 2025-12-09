<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Viaje;
use App\Models\User;

echo "--- USERS ---\n";
foreach (User::all() as $u) {
    echo "ID: {$u->id}, Name: {$u->name}, Email:{$u->email}, Rol: {$u->rol}\n";
}

echo "\n--- VIAJES ---\n";
$viajes = Viaje::all();
if ($viajes->isEmpty()) {
    echo "No trips found.\n";
} else {
    foreach ($viajes as $v) {
        echo "ID: {$v->id}\n";
        echo "  Cliente: {$v->cliente_id}\n";
        echo "  Motorista: {$v->motorista_id}\n";
        echo "  Estado: '{$v->estado}'\n";
        echo "  Origen: {$v->origen_lat}, {$v->origen_lng}\n";
        echo "  Destino: {$v->destino_lat}, {$v->destino_lng}\n";
        echo "----------------\n";
    }
}
