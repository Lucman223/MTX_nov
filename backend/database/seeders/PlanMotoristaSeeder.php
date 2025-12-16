<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\PlanMotorista;

class PlanMotoristaSeeder extends Seeder
{
    public function run(): void
    {
        $planes = [
            [
                'nombre' => 'Pase Diario',
                'descripcion' => 'Acceso completo a la plataforma por 24 horas.',
                'precio' => 500.00,
                'dias_validez' => 1,
                'es_vip' => false,
            ],
            [
                'nombre' => 'Pase Semanal',
                'descripcion' => 'Ahorra con el plan semanal. Acceso por 7 días.',
                'precio' => 2500.00,
                'dias_validez' => 7,
                'es_vip' => false,
            ],
            [
                'nombre' => 'Pase Mensual',
                'descripcion' => 'La opción más rentable. Acceso por 30 días.',
                'precio' => 10000.00,
                'dias_validez' => 30,
                'es_vip' => false,
            ],
            [
                'nombre' => 'VIP Mensual',
                'descripcion' => 'Prioridad en asignación de viajes + Acceso Mensual.',
                'precio' => 15000.00,
                'dias_validez' => 30,
                'es_vip' => true,
            ],
        ];

        foreach ($planes as $plan) {
            PlanMotorista::updateOrCreate(
                ['nombre' => $plan['nombre']], // Avoid duplicates if run multiple times
                $plan
            );
        }
    }
}
