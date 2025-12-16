<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin
        User::create([
            'name' => 'Admin Principal',
            'email' => 'admin@mototx.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'rol' => 'admin',
        ]);

        // 2. Cliente
        User::create([
            'name' => 'Cliente Pruebas',
            'email' => 'cliente@mototx.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'rol' => 'cliente',
        ]);

        // 3. Motorista
        $moto = User::create([
            'name' => 'Motorista Pruebas',
            'email' => 'moto@mototx.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password123'),
            'rol' => 'motorista',
        ]);

        // Crear perfil del motorista
        \App\Models\MotoristaPerfil::create([
            'usuario_id' => $moto->id,
            'marca_vehiculo' => 'Yamaha Crypton',
            'matricula' => 'AB-123-CD',
            'estado_validacion' => 'aprobado', // Auto-aprobar para pruebas
            'estado_actual' => 'inactivo',
            'documento_licencia_path' => 'docs/dummy.pdf',
            'viajes_prueba_restantes' => 3
        ]);

        $this->call(PlanesMotoristaSeeder::class);
        $this->call(ForfaitSeeder::class);
    }
}
