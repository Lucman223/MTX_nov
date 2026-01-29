<?php

use App\Models\User;
use App\Models\Viaje;
use App\Models\MotoristaPerfil;
use App\Models\ClienteForfait;
use App\Models\Forfait;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- STARTING SIMULATION ---\n";

// 1. SETUP USERS
echo "\n[1] Setting up Users...\n";
\Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
User::truncate();
MotoristaPerfil::truncate();
Viaje::truncate();
ClienteForfait::truncate();
\Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

$admin = User::create([
    'name' => 'Admin Test',
    'email' => 'admin@mototx.com',
    'password' => Hash::make('password'),
    'rol' => 'admin',
    'telefono' => '00000000'
]);

$client = User::create([
    'name' => 'Cliente Test',
    'email' => 'cliente@mototx.com',
    'password' => Hash::make('password'),
    'rol' => 'cliente',
    'telefono' => '11111111'
]);

$motorista = User::create([
    'name' => 'Moto Test',
    'email' => 'moto@mototx.com',
    'password' => Hash::make('password123'),
    'rol' => 'motorista',
    'telefono' => '22222222'
]);

MotoristaPerfil::create([
    'usuario_id' => $motorista->id,
    'marca_vehiculo' => 'Yamaha',
    'matricula' => 'AB-123-CD',
    'documento_licencia_path' => 'dummy/path/licencia.jpg', // FIX: Added required field
    'estado_validacion' => 'pendiente',
    'estado_actual' => 'inactivo'
]);

echo "Users created. ID Admin: {$admin->id}, Moto: {$motorista->id}, Client: {$client->id}\n";

// 2. ADMIN APPROVAL
echo "\n[2] Admin Approving Motorista...\n";
$perfil = MotoristaPerfil::where('usuario_id', $motorista->id)->first();
$perfil->update(['estado_validacion' => 'aprobado']);
$perfil->update(['estado_actual' => 'activo']); 
echo "Motorista approved and active.\n";

// 3. CLIENT BUY FORFAIT
echo "\n[3] Client 'buying' Forfait...\n";
ClienteForfait::create([
    'cliente_id' => $client->id,
    'viajes_restantes' => 5,
    'fecha_expiracion' => now()->addMonth(),
    'forfait_id' => 1 // Dummy
]);
echo "Forfait assigned.\n";

// 4. CLIENT REQUESTS TRIP
echo "\n[4] Client requesting trip...\n";
$viajeData = [
    'origen_lat' => 12.6,
    'origen_lng' => -8.0,
    'destino_lat' => 12.65,
    'destino_lng' => -7.95,
];

// Determine if we call controller or service. Calling Service directly for simulation speed.
$viajeService = app(\App\Services\ViajeService::class);
try {
    $viaje = $viajeService->solicitarViaje($client, $viajeData['origen_lat'], $viajeData['origen_lng'], $viajeData['destino_lat'], $viajeData['destino_lng']);
    echo "Trip requested! ID: {$viaje->id}, Status: {$viaje->estado}\n";
} catch (\Exception $e) {
    echo "ERROR requesting trip: " . $e->getMessage() . "\n";
    exit;
}

// 5. MOTORISTA ACCEPTS TRIP
echo "\n[5] Motorista accepting trip...\n";
try {
    $viaje = $viajeService->acceptTrip($motorista, $viaje);
    echo "Trip accepted! Status: {$viaje->estado}\n";
} catch (\Exception $e) {
    echo "ERROR accepting trip: " . $e->getMessage() . "\n";
    exit;
}

// 6. MAP UPDATE SIMULATION
echo "\n[6] Simulating Movement (Map Integration)...\n";
$motoService = app(\App\Services\MotoristaService::class);

echo " - Moto moves to 12.61, -7.99\n";
$motoService->updateLocation($motorista, 12.61, -7.99);

// Check if Client sees it
$viaje->refresh();
$viaje->load('motorista.motorista_perfil');
$loc = $viaje->motorista->motorista_perfil;
echo " - Client checks map... Moto is at: [{$loc->latitud_actual}, {$loc->longitud_actual}]\n";

if ($loc->latitud_actual == 12.61) {
    echo "SUCCESS: Location update visible to client.\n";
} else {
    echo "FAIL: Location mismatch.\n";
}

// 7. COMPLETION
echo "\n[7] Completing Trip...\n";
$viajeService->updateTripStatus($motorista, $viaje, 'en_curso');
echo " - Trip Started.\n";
$viajeService->updateTripStatus($motorista, $viaje, 'completado');
echo " - Trip Completed.\n";

// Check balance
$balance = ClienteForfait::where('cliente_id', $client->id)->first()->viajes_restantes;
echo "\nFinal Client Balance: {$balance} (Started with 5)\n";

echo "\n--- SIMULATION COMPLETE ---\n";
