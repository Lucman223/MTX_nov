<?php

namespace App\Http\Controllers;

use App\Models\Forfait;
use App\Models\ClienteForfait;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ClienteForfaitController extends Controller
{
    public function buyForfait(Request $request)
    {
        $request->validate([
            'forfait_id' => 'required|exists:forfaits,id',
        ]);

        $forfait = Forfait::find($request->forfait_id);

        if ($forfait->estado !== 'activo') {
            return response()->json(['error' => 'This forfait is not active'], 400);
        }

        $user = auth()->user();

        $clienteForfait = ClienteForfait::create([
            'cliente_id' => $user->id,
            'forfait_id' => $forfait->id,
            'fecha_compra' => Carbon::now(),
            'fecha_expiracion' => Carbon::now()->addDays($forfait->dias_validez),
            'viajes_restantes' => $forfait->viajes_incluidos,
        ]);

        return response()->json([
            'message' => 'Forfait purchased successfully',
            'data' => $clienteForfait,
        ], 201);
    }
}
