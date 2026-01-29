<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\MotoristaPerfil;

$user = User::where('email', 'amadou@test.com')->first();
if (!$user) {
    $user = User::create([
        'name' => 'Amadou Koné',
        'email' => 'amadou@test.com',
        'password' => 'password',
        'rol' => 'motorista'
    ]);
}

$perfil = MotoristaPerfil::firstOrNew(['usuario_id' => $user->id]);
$perfil->matricula = 'BKO-MT-2024';
$perfil->marca_vehiculo = 'Yamaha 125';
$perfil->viajes_prueba_restantes = 10;
$perfil->billetera = 4500.50;
$perfil->estado_validacion = 'aprobado';
$perfil->save();

echo "User amadou@test.com fixed with profile and balance.\n";
