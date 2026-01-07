<?php

use App\Models\User;
use App\Models\MotoristaPerfil;
use App\Models\Transaccion;
use Illuminate\Support\Facades\Auth;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- MOTO-TX: PRUEBA DE RETIRO DIARIO ---\n";

// 1. Buscar o crear el motorista de prueba
$email = 'amadou@test.com';
$user = User::where('email', $email)->first();

if (!$user) {
    echo "Motorista no encontrado. Ejecutando create_test_motorista.php...\n";
    include 'create_test_motorista.php';
    $user = User::where('email', $email)->first();
}

$perfil = MotoristaPerfil::where('usuario_id', $user->id)->first();

// 2. Simular que el motorista ha ganado dinero (añadir saldo)
$gananciaSimulada = 5000;
echo "Simulando saldo inicial de: " . $perfil->billetera . " CFA\n";
echo "Añadiendo ganancia de : " . $gananciaSimulada . " CFA...\n";

$perfil->increment('billetera', $gananciaSimulada);
$perfil->refresh();

echo "Saldo actual en billetera: " . $perfil->billetera . " CFA\n";
echo "----------------------------------------\n";

// 3. Ejecutar un retiro
$montoRetiro = 3500;
echo "SOLICITANDO RETIRO DE: " . $montoRetiro . " CFA...\n";

if ($perfil->billetera < $montoRetiro) {
    echo "❌ ERROR: Saldo insuficiente.\n";
    exit;
}

// Lógica del controlador simulada
$perfil->decrement('billetera', $montoRetiro);
$transaccion = Transaccion::create([
    'usuario_id' => $user->id,
    'monto' => $montoRetiro,
    'tipo' => 'retiro_saldo',
    'estado' => 'completado',
    'metodo_pago' => 'Orange Money',
    'descripcion' => 'PRUEBA: Retiro de ganancias diarias',
    'fecha_transaccion' => now(),
]);

$perfil->refresh();

echo "✅ RETIRO EXITOSO!\n";
echo "ID Transacción: " . $transaccion->id . "\n";
echo "Nuevo saldo en billetera: " . $perfil->billetera . " CFA\n";
echo "----------------------------------------\n";
echo "Prueba finalizada técnicamente.\n";
