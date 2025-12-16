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

        // Create Plans
        $plans = [
            ['name' => 'Pack Prueba', 'viajes' => 5, 'precio' => 2500, 'days' => 15],
            ['name' => 'Pack Estándar', 'viajes' => 10, 'precio' => 5000, 'days' => 30],
            ['name' => 'Pack Viajero', 'viajes' => 20, 'precio' => 9000, 'days' => 45],
            ['name' => 'Pack Pro', 'viajes' => 50, 'precio' => 20000, 'days' => 60],
        ];

        foreach ($plans as $p) {
            $plan = Forfait::firstOrCreate(
                ['nombre' => $p['name']],
                ['precio' => $p['precio'], 'viajes_incluidos' => $p['viajes'], 'dias_validez' => $p['days']]
            );

            // Assign Standard Pack (10) to dummy client initially
            if ($p['viajes'] === 10) {
                 ClienteForfait::firstOrCreate([
                    'cliente_id' => $cliente->id,
                    'forfait_id' => $plan->id
                ], [
                    'viajes_restantes' => 10,
                    'fecha_compra' => Carbon::now(),
                    'fecha_expiracion' => Carbon::now()->addDays(30)
                ]);
            }
        }

        echo "Seeded 10 trips for user: " . $cliente->email . "\n";
    }
}
