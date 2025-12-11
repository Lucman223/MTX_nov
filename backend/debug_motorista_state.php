<?php

use App\Models\User;
use App\Models\MotoristaPerfil;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Motorista Debug ---\n";

// Find moto@test.com
$user = User::where('email', 'moto@test.com')->first();

if (!$user) {
    echo "User moto@test.com NOT FOUND.\n";
    exit;
}

echo "User: {$user->name} (ID: {$user->id})\n";
echo "Rol: {$user->rol}\n";

$profile = MotoristaPerfil::where('usuario_id', $user->id)->first();

if (!$profile) {
    echo "PROFILE: NOT FOUND (This is the error).\n";
} else {
    echo "PROFILE: Found (ID: {$profile->id})\n";
    echo "Estado Actual: {$profile->estado_actual}\n"; // Should be 'activo'
    echo "Is Valid? " . ($profile->estado_actual === 'activo' ? 'YES' : 'NO') . "\n";
}
