<?php

use App\Models\User;
use App\Models\MotoristaPerfil;
use Illuminate\Support\Facades\Hash;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Creating pending motorista for testing...\n";

$motorista = User::create([
    'name' => 'Amadou Koné',
    'email' => 'amadou@test.com',
    'password' => Hash::make('password'),
    'rol' => 'motorista',
    'telefono' => '76543210'
]);

MotoristaPerfil::create([
    'usuario_id' => $motorista->id,
    'marca_vehiculo' => 'Honda CG 125',
    'matricula' => 'BKO-456-ML',
    'documento_licencia_path' => 'uploads/licencias/amadou_licencia.jpg',
    'estado_validacion' => 'pendiente',
    'estado_actual' => 'inactivo'
]);

echo "✅ Motorista created successfully!\n";
echo "Name: Amadou Koné\n";
echo "Email: amadou@test.com\n";
echo "Status: PENDIENTE\n";
echo "\nYou can now approve this motorista from the Admin dashboard.\n";
