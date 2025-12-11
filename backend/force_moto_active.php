<?php

use App\Models\User;
use App\Models\MotoristaPerfil;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Force Moto Active ---\n";

$user = User::where('email', 'moto@test.com')->first();
$profile = MotoristaPerfil::where('usuario_id', $user->id)->firstOrFail();

$profile->update(['estado_actual' => 'activo']);

echo "Updated Motorista (ID {$user->id}) to ACTIVO.\n";
