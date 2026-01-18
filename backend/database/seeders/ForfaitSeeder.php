<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ClienteForfait;
use App\Models\Forfait;
use Carbon\Carbon;

class ForfaitSeeder extends Seeder
{
    public function run()
    {
        $cliente = User::where('rol', 'cliente')->first();
        if (!$cliente) {
            echo "No client found to seed forfait.\n";
            return;
        }

        // Create Plans with Distance Restrictions
        $plans = [
            ['name' => 'Pack Urbano Bamako (5km)', 'viajes' => 5, 'precio' => 2500, 'days' => 15, 'dist' => 5],
            ['name' => 'Pack Confort (10km)', 'viajes' => 10, 'precio' => 5000, 'days' => 30, 'dist' => 10],
            ['name' => 'Pack Viajero (15km)', 'viajes' => 20, 'precio' => 9000, 'days' => 45, 'dist' => 15],
            ['name' => 'Pack Transversale (Pro)', 'viajes' => 50, 'precio' => 22000, 'days' => 60, 'dist' => 0], // 0 = Sin límite
        ];

        foreach ($plans as $p) {
            $plan = Forfait::updateOrCreate(
                ['nombre' => $p['name']],
                [
                    'precio' => $p['precio'], 
                    'viajes_incluidos' => $p['viajes'], 
                    'dias_validez' => $p['days'],
                    'distancia_maxima' => $p['dist']
                ]
            );

            // Assign "Pack Urbano" to user for testing limits
            if ($p['dist'] === 5) {
                 ClienteForfait::updateOrCreate([
                    'cliente_id' => $cliente->id,
                    'forfait_id' => $plan->id
                ], [
                    'viajes_restantes' => 5,
                    'fecha_compra' => Carbon::now(),
                    'fecha_expiracion' => Carbon::now()->addDays(15),
                    'estado' => 'activo'
                ]);
            }
        }

        echo "Seeded 10 trips for user: " . $cliente->email . "\n";
    }
}
