<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Forfait;

class ForfaitPlanSeeder extends Seeder
{
    public function run()
    {
        Forfait::create([
            'nombre' => 'Viaje Único',
            'precio' => 1000,
            'viajes_incluidos' => 1,
            'dias_validez' => 1,
            'estado' => 'activo'
        ]);

        Forfait::create([
            'nombre' => 'Pack 10 Viajes',
            'precio' => 9000,
            'viajes_incluidos' => 10,
            'dias_validez' => 30,
            'estado' => 'activo'
        ]);

        Forfait::create([
            'nombre' => 'Mensual Ilimitado (Demo top 50)',
            'precio' => 30000,
            'viajes_incluidos' => 50,
            'dias_validez' => 30,
            'estado' => 'activo'
        ]);

        echo "Forfait plans seeded.\n";
    }
}
