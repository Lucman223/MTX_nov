<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\ClienteForfait;
use App\Models\Forfait;
use Carbon\Carbon;

echo "=========================================\n";
echo "   RECREANDO CLIENTE DE PRUEBAS \n";
echo "=========================================\n\n";

$clienteEmail = 'cliente_test@mtx.com';

// Buscar o crear
$cliente = User::where('email', $clienteEmail)->first();

if (!$cliente) {
    $cliente = new User();
    $cliente->name = 'Pasajero de Pruebas';
    $cliente->email = $clienteEmail;
    $cliente->password = bcrypt('password123');
    $cliente->rol = 'cliente';
    $cliente->telefono = '30004000';
    $cliente->status = 'aprobado';
    $cliente->save();
    echo "Cliente insertado por primera vez.\n";
} else {
    $cliente->password = bcrypt('password123');
    $cliente->save();
    echo "Cliente ya existía, contraseña reiniciada.\n";
}

$forfait = ClienteForfait::where('cliente_id', $cliente->id)->first();
if (!$forfait) {
    $forfait = new ClienteForfait();
    $forfait->cliente_id = $cliente->id;
    // Assuming forfait_id instead of paquete_id based on typical Laravel conventions
    $forfait->forfait_id = Forfait::first()->id ?? 1; 
    $forfait->viajes_restantes = 100;
    $forfait->fecha_compra = Carbon::now();
    $forfait->fecha_expiracion = Carbon::now()->addYear();
    $forfait->estado = 'activo';
    $forfait->save();
} else {
    $forfait->viajes_restantes = 100;
    $forfait->estado = 'activo';
    $forfait->fecha_expiracion = Carbon::now()->addYear();
    $forfait->save();
}

echo "✅ CLIENTE CREADO/ACTUALIZADO (Con 100 viajes de saldo):\n";
echo "   - Email: {$cliente->email}\n";
echo "   - Contraseña: password123\n\n";
