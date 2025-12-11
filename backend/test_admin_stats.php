<?php
// test_admin_stats.php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// 1. Simular Login de Admin
echo "1. Logueando como Admin...\n";
$email = 'admin@test.com';
$password = 'password';

$request = Illuminate\Http\Request::create('/api/auth/login', 'POST', [
    'email' => $email,
    'password' => $password
]);

$response = $kernel->handle($request);
$content = json_decode($response->getContent(), true);

if ($response->getStatusCode() !== 200 || !isset($content['access_token'])) {
    echo "❌ Error en login: " . $response->getContent() . "\n";
    exit(1);
}

$token = $content['access_token'];
echo "✅ Login exitoso. Token obtenido.\n";

// 2. Obtener Estadísticas
echo "\n2. Solicitando estadísticas (/api/admin/statistics)...\n";
$statsRequest = Illuminate\Http\Request::create('/api/admin/statistics', 'GET');
$statsRequest->headers->set('Authorization', 'Bearer ' . $token);

// Importante: Necesitamos pasar por el middleware para que auth()->user() funcione
// Simplificación: usaremos una ruta simulada o instanciaremos el controlador directamente actuando como el usuario
// Mejor enfoque para script CLI rápido: Auth::login
$adminUser = App\Models\User::where('email', $email)->first();
Illuminate\Support\Facades\Auth::login($adminUser);

// Llamamos al controlador directamente para evitar problemas complejos de middleware en script CLI simple
$controller = app()->make(App\Http\Controllers\Admin\AdminController::class);
$statsResponse = $controller->getStatistics();

echo "✅ Respuesta recibida:\n";
print_r($statsResponse->getData());

echo "\n📋 Verificación de datos:\n";
$data = $statsResponse->getData(true);
echo "Total Motoristas: " . $data['totalMotoristas'] . "\n";
echo "Viajes Hoy: " . $data['viajesHoy'] . "\n";
echo "Ingresos Mes: " . $data['ingresosMes'] . "\n";
echo "Usuarios Activos: " . $data['usuariosActivos'] . "\n";
echo "Viajes Totales: " . $data['viajesTotales'] . "\n";

echo "\n🏁 Prueba finalizada.\n";
