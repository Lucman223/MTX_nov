<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\MotoristaPerfil;
use App\Models\ClienteForfait;
use Carbon\Carbon;

echo "=========================================\n";
echo "   CREANDO USUARIOS DE PRUEBA INFALIBLES \n";
echo "=========================================\n\n";

// 1. Crear Motorista de Pruebas
$motoristaEmail = 'moto_test@mtx.com';
$motorista = User::firstOrCreate(
    ['email' => $motoristaEmail],
    [
        'name' => 'Piloto de Pruebas',
        'password' => bcrypt('password123'),
        'rol' => 'motorista',
        'telefono' => '10002000',
        'status' => 'aprobado'
    ]
);

// Asegurar que el motorista tenga su perfil creado y configurado correctamente para recibir viajes
$perfil = MotoristaPerfil::firstOrCreate(
    ['usuario_id' => $motorista->id],
    [
        'marca_vehiculo' => 'Honda',
        'matricula' => 'TEST-001',
        'documento_licencia_path' => 'demo',
        'estado_actual' => 'activo',
        'estado_validacion' => 'aprobado',
        'billetera' => 5000,
        'viajes_prueba_restantes' => 10
    ]
);
// Forzar estado activo
$perfil->update(['estado_actual' => 'activo', 'estado_validacion' => 'aprobado']);
$motorista->update(['status' => 'aprobado']);

echo "✅ MOTORISTA CREADO/ACTUALIZADO:\n";
echo "   - Email: {$motorista->email}\n";
echo "   - Contraseña: password123\n\n";

// 2. Crear Cliente de Pruebas
$clienteEmail = 'cliente_test@mtx.com';
$cliente = User::firstOrCreate(
    ['email' => $clienteEmail],
    [
        'name' => 'Pasajero de Pruebas',
        'password' => bcrypt('password123'),
        'rol' => 'cliente',
        'telefono' => '30004000',
        'status' => 'aprobado' // O activo, depende de cómo esté tu DB
    ]
);

// Asegurar que el cliente tenga forfaits para pedir viajes (sino, el sistema podría rechazar las peticiones)
$forfait = ClienteForfait::firstOrCreate(
    ['cliente_id' => $cliente->id],
    [
        'paquete_id' => 1, // Asumiendo que existe un paquete con ID 1
        'viajes_restantes' => 100,
        'fecha_compra' => Carbon::now(),
        'fecha_expiracion' => Carbon::now()->addYear(),
        'estado' => 'activo'
    ]
);
// Forzar viajes restantes por si ya existía sin saldo
$forfait->update(['viajes_restantes' => 100, 'estado' => 'activo', 'fecha_expiracion' => Carbon::now()->addYear()]);

echo "✅ CLIENTE CREADO/ACTUALIZADO (Con 100 viajes de saldo):\n";
echo "   - Email: {$cliente->email}\n";
echo "   - Contraseña: password123\n\n";

echo "=========================================\n";
echo " INSTRUCCIONES DE PRUEBA: \n";
echo " 1. Ingresa como CLIENTE ({$cliente->email}) en una ventana de incógnito y solicita un viaje.\n";
echo " 2. Manten abierta la sesión del MOTORISTA ({$motorista->email}) en tu ventana normal.\n";
echo " 3. El viaje debería aparecer instantáneamente.\n";
echo "=========================================\n";
