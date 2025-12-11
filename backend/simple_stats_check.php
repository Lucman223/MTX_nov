<?php
// simple_stats_check.php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Viaje;

echo "--- VERIFICACIÓN DE DATOS ---\n";

try {
    $totalMotoristas = User::where('rol', 'motorista')
        ->whereHas('motorista_perfil', function($q) {
            $q->where('estado_validacion', 'aprobado');
        })->count();
    echo "Motoristas Aprobados: $totalMotoristas\n";
} catch (\Exception $e) {
    echo "Error Motoristas: " . $e->getMessage() . "\n";
}

try {
    $viajesTotales = Viaje::count();
    echo "Viajes Totales: $viajesTotales\n";
} catch (\Exception $e) {
    echo "Error Viajes: " . $e->getMessage() . "\n";
}

try {
    $usuariosActivos = User::whereIn('rol', ['cliente', 'motorista'])->count();
    echo "Usuarios Activos: $usuariosActivos\n";
} catch (\Exception $e) {
    echo "Error Usuarios: " . $e->getMessage() . "\n";
}

try {
    $ingresosMes = \App\Models\ClienteForfait::whereMonth('fecha_compra', now()->month)
        ->whereYear('fecha_compra', now()->year)
        ->join('forfaits', 'clientes_forfaits.forfait_id', '=', 'forfaits.id')
        ->sum('forfaits.precio');
    echo "Ingresos Mes: $ingresosMes\n";
} catch (\Exception $e) {
    echo "Error Ingresos: " . $e->getMessage() . "\n";
}
