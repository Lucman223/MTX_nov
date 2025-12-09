<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\MotoristaPerfil;

class MotoristaSeeder extends Seeder
{
    public function run()
    {
        $moto = User::where('email', 'moto@mototx.com')->first();
        if (!$moto) {
            echo "Creating motorist user...\n";
            $moto = User::create([
                'name' => 'Motorista Pruebas',
                'email' => 'moto@mototx.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'rol' => 'motorista',
            ]);
        }

        // Create or Update Profile
        // Ensure table name is correct in Model!
        MotoristaPerfil::updateOrCreate(
            ['usuario_id' => $moto->id],
            [
                'marca_vehiculo' => 'Yamaha Test',
                'matricula' => 'TEST-001',
                'estado_validacion' => 'aprobado', // Directamente aprobado
                'estado_actual' => 'activo',       // Directamente activo
                'documento_licencia_path' => 'demo/path.jpg'
            ]
        );

        echo "Motorist profile seeded (Active/Approved) for: " . $moto->email . "\n";
    }
}
