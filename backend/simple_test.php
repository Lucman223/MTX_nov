<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\MotoristaPerfil;
use App\Models\Transaccion;

$user = User::where('email', 'amadou@test.com')->first();
if (!$user) {
    $user = User::create([
        'name' => 'Test Motorista',
        'email' => 'amadou@test.com',
        'password' => bcrypt('password'),
        'rol' => 'motorista'
    ]);
    MotoristaPerfil::create(['usuario_id' => $user->id, 'matricula' => 'TEST-123']);
}

$perfil = MotoristaPerfil::where('usuario_id', $user->id)->first();
echo "SALDO INICIAL: " . $perfil->billetera . " CFA\n";

echo "AÑADIENDO 5000 CFA DE GANANCIAS...\n";
$perfil->increment('billetera', 5000);
$perfil->refresh();
echo "SALDO TRAS GANANCIA: " . $perfil->billetera . " CFA\n";

echo "SOLICITANDO RETIRO DE 3500 CFA...\n";
$perfil->decrement('billetera', 3500);
Transaccion::create([
    'usuario_id' => $user->id,
    'monto' => 3500,
    'tipo' => 'retiro_saldo',
    'estado' => 'completado',
    'metodo_pago' => 'Orange Money',
    'descripcion' => 'RETIRO PRUEBA'
]);
$perfil->refresh();
echo "RETIRO EXITOSO. SALDO FINAL: " . $perfil->billetera . " CFA\n";
