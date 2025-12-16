<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Viaje;

class DemoViajeSeeder extends Seeder
{
    public function run(): void
    {
        $cliente = User::where('email', 'cliente@mototx.com')->first();
        
        if ($cliente) {
            Viaje::create([
                'cliente_id' => $cliente->id,
                'origen_lat' => 12.6392, 
                'origen_lng' => -8.0029,
                'destino_lat' => 12.6450, 
                'destino_lng' => -8.0100, 
                'estado' => 'solicitado'
            ]);
            $this->command->info('Viaje de prueba creado correctamente.');
        } else {
            $this->command->error('No sed encontró el cliente de prueba.');
        }
    }
}
