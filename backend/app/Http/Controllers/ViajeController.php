<?php

namespace App\Http\Controllers;

use App\Models\Viaje;
use App\Models\ClienteForfait;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\MotoristaPerfil; // Import MotoristaPerfil

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

    public function getSolicitedTrips()
    {
        // Only return trips that are 'solicitado' and have no motorista assigned yet
        $solicitedTrips = Viaje::where('estado', 'solicitado')
                               ->whereNull('motorista_id')
                               ->get();

        return response()->json($solicitedTrips);
    }

    public function acceptTrip(Request $request, Viaje $viaje)
    {
        $motorista = auth()->user();

        // Check if the authenticated user is a motorista
        if ($motorista->rol !== 'motorista') {
            return response()->json(['error' => 'Forbidden: Only motoristas can accept trips'], 403);
        }

        // Check if the motorista is active
        $motoristaPerfil = MotoristaPerfil::where('usuario_id', $motorista->id)->first();
        if (!$motoristaPerfil || $motoristaPerfil->estado_actual !== 'activo') {
            return response()->json(['error' => 'Motorista is not active or profile not found'], 400);
        }

        // Check if the trip is solicited and not already accepted
        if ($viaje->estado !== 'solicitado' || $viaje->motorista_id !== null) {
            return response()->json(['error' => 'Trip is not available for acceptance'], 400);
        }

        $viaje->update([
            'motorista_id' => $motorista->id,
            'estado' => 'aceptado',
        ]);

        return response()->json([
            'message' => 'Trip accepted successfully',
            'data' => $viaje,
        ]);
    }
}
