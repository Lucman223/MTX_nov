<?php

namespace App\Http\Controllers;

use App\Models\Viaje;
use App\Models\ClienteForfait;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ViajeController extends Controller
{
    public function solicitarViaje(Request $request)
    {
        $request->validate([
            'origen_lat' => 'required|numeric',
            'origen_lng' => 'required|numeric',
        ]);

        $user = auth()->user();

        // Find an active forfait for the user with remaining trips
        $clienteForfait = ClienteForfait::where('cliente_id', $user->id)
            ->where('viajes_restantes', '>', 0)
            ->where('fecha_expiracion', '>', Carbon::now())
            ->first();

        if (!$clienteForfait) {
            return response()->json(['error' => 'No active forfait with remaining trips found'], 400);
        }

        // Create the trip
        $viaje = Viaje::create([
            'cliente_id' => $user->id,
            'origen_lat' => $request->origen_lat,
            'origen_lng' => $request->origen_lng,
            'estado' => 'solicitado',
        ]);

        // Decrement remaining trips
        $clienteForfait->decrement('viajes_restantes');

        return response()->json([
            'message' => 'Trip requested successfully',
            'data' => $viaje,
        ], 201);
    }
}
