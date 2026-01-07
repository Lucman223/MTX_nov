<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\MotoristaPerfil;
use App\Models\Transaccion;

$user = User::where('rol', 'motorista')->first();
if (!$user) {
    echo "No hay motoristas en la BD.";
    exit;
}

$perfil = MotoristaPerfil::where('usuario_id', $user->id)->first();
$saldo_inicial = (float) $perfil->billetera;

echo "--- MOTO-TX: PRUEBA DE RETIRO ---\n";
echo "Motorista: " . $user->name . " (" . $user->email . ")\n";
echo "Saldo en Billetera: " . $saldo_inicial . " CFA\n";

$ingreso = 5000;
echo "1. Simulando ingreso de viaje: +" . $ingreso . " CFA\n";
$perfil->increment('billetera', $ingreso);
$perfil->refresh();
echo "   Nuevo Saldo: " . $perfil->billetera . " CFA\n";

$retiro = 3000;
echo "2. Solicitando Retiro Diario: -" . $retiro . " CFA\n";
if ($perfil->billetera >= $retiro) {
    $perfil->decrement('billetera', $retiro);
    Transaccion::create([
        'usuario_id' => $user->id,
        'monto' => $retiro,
        'tipo' => 'retiro_saldo',
        'estado' => 'completado',
        'metodo_pago' => 'Orange Money',
        'descripcion' => 'Retiro diario de prueba',
        'fecha_transaccion' => now()
    ]);
    $perfil->refresh();
    echo "   ✅ CANJE EXITOSO. Saldo Final: " . $perfil->billetera . " CFA\n";
} else {
    echo "   ❌ Saldo insuficiente.\n";
}
echo "---------------------------------\n";
