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

        // Create a Standard Plan if not exists
        $plan = Forfait::firstOrCreate(
            ['nombre' => 'Pack 10 Viajes'],
            ['precio' => 5000, 'viajes_incluidos' => 10, 'dias_validez' => 30]
        );

        // Assign to Client
        ClienteForfait::create([
            'cliente_id' => $cliente->id,
            'forfait_id' => $plan->id,
            'viajes_restantes' => 10,
            'fecha_compra' => Carbon::now(),
            'fecha_expiracion' => Carbon::now()->addDays(30)
        ]);

        echo "Seeded 10 trips for user: " . $cliente->email . "\n";
    }
}
