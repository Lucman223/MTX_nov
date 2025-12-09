<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\MotoristaPerfil;

$moto = User::where('email', 'moto@mototx.com')->first();
if (!$moto) {
    echo "Motorist User NOT FOUND.\n";
    exit;
}

echo "User found: ID {$moto->id}, Rol: {$moto->rol}\n";

$perfil = MotoristaPerfil::where('usuario_id', $moto->id)->first();
if (!$perfil) {
    echo "MotoristaPerfil NOT FOUND for user {$moto->id}.\n";
} else {
    echo "MotoristaPerfil found:\n";
    echo "  ID: {$perfil->id}\n";
    echo "  Estado Validacion: {$perfil->estado_validacion}\n";
    echo "  Estado Actual: {$perfil->estado_actual}\n";
}
