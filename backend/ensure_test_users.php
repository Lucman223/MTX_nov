<?php
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\MotoristaPerfil;

$password = Hash::make('123456');

// 1. Cliente Test
User::updateOrCreate(
    ['email' => 'cliente1@test.com'],
    [
        'name' => 'Cliente Test 1',
        'password' => $password,
        'rol' => 'cliente'
    ]
);
echo "Created/Updated: cliente1@test.com\n";

// 2. Moto Test
$moto = User::updateOrCreate(
    ['email' => 'moto1@test.com'],
    [
        'name' => 'Moto Test 1',
        'password' => $password,
        'rol' => 'motorista'
    ]
);
echo "Created/Updated: moto1@test.com\n";

// Ensure profile exists for Moto
if ($moto) {
    MotoristaPerfil::firstOrCreate(
        ['usuario_id' => $moto->id],
        [
            'marca_vehiculo' => 'Test Bike',
            'matricula' => 'TEST-001',
            'estado_validacion' => 'aprobado',
            'estado_actual' => 'activo'
        ]
    );
}

// 3. Admin Test
User::updateOrCreate(
    ['email' => 'admin@test.com'],
    [
        'name' => 'Admin Test',
        'password' => $password,
        'rol' => 'admin'
    ]
);
echo "Created/Updated: admin@test.com\n";
