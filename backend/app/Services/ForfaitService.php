<?php

namespace App\Services;

use App\Models\Forfait;
use App\Models\ClienteForfait;
use App\Models\User;
use Carbon\Carbon;

class ForfaitService
{
    public function buyForfait(User $user, int $forfaitId): ClienteForfait
    {
        $forfait = Forfait::find($forfaitId);

        if (!$forfait || $forfait->estado !== 'activo') {
            throw new \Exception('This forfait is not active or not found');
        }

        $clienteForfait = ClienteForfait::create([
            'cliente_id' => $user->id,
            'forfait_id' => $forfait->id,
            'fecha_compra' => Carbon::now(),
            'fecha_expiracion' => Carbon::now()->addDays($forfait->dias_validez),
            'viajes_restantes' => $forfait->viajes_incluidos,
        ]);

        return $clienteForfait;
    }
}
