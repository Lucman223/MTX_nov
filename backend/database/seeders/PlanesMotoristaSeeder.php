<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanesMotoristaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('planes_motorista')->insert([
            [
                'nombre' => 'Diario',
                'descripcion' => 'Acceso completo por 24 horas',
                'precio' => 500.00,
                'dias_validez' => 1,
                'es_vip' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Semanal',
                'descripcion' => 'Ahorra con el plan semanal',
                'precio' => 2500.00,
                'dias_validez' => 7,
                'es_vip' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Mensual VIP',
                'descripcion' => 'Acceso premium y prioridad en asignación',
                'precio' => 10000.00,
                'dias_validez' => 30,
                'es_vip' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
