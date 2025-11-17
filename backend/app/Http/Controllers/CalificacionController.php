<?php

namespace App\Http\Controllers;

use App\Models\Calificacion;
use App\Models\Viaje;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CalificacionController extends Controller
{
    public function rateMotorista(Request $request, Viaje $viaje)
    {
        $user = auth()->user();

        // Ensure the trip is completed and the authenticated user is the client of this trip
        if ($viaje->estado !== 'completado' || $viaje->cliente_id !== $user->id) {
            return response()->json(['error' => 'Cannot rate motorista for this trip'], 400);
        }

        // Ensure the motorista is assigned to this trip
        if (!$viaje->motorista_id) {
            return response()->json(['error' => 'No motorista assigned to this trip'], 400);
        }

        // Prevent duplicate rating
        if (Calificacion::where('viaje_id', $viaje->id)
                        ->where('calificador_id', $user->id)
                        ->where('calificado_id', $viaje->motorista_id)
                        ->where('tipo', 'cliente_a_motorista')
                        ->exists()) {
            return response()->json(['error' => 'Motorista already rated for this trip'], 400);
        }

        $request->validate([
            'puntuacion' => ['required', 'integer', 'min:1', 'max:5'],
            'comentario' => 'nullable|string|max:500',
        ]);

        $calificacion = Calificacion::create([
            'viaje_id' => $viaje->id,
            'calificador_id' => $user->id,
            'calificado_id' => $viaje->motorista_id,
            'puntuacion' => $request->puntuacion,
            'comentario' => $request->comentario,
            'tipo' => 'cliente_a_motorista',
        ]);

        return response()->json([
            'message' => 'Motorista rated successfully',
            'data' => $calificacion,
        ], 201);
    }

    public function rateCliente(Request $request, Viaje $viaje)
    {
        $user = auth()->user();

        // Ensure the trip is completed and the authenticated user is the motorista of this trip
        if ($viaje->estado !== 'completado' || $viaje->motorista_id !== $user->id) {
            return response()->json(['error' => 'Cannot rate client for this trip'], 400);
        }

        // Prevent duplicate rating
        if (Calificacion::where('viaje_id', $viaje->id)
                        ->where('calificador_id', $user->id)
                        ->where('calificado_id', $viaje->cliente_id)
                        ->where('tipo', 'motorista_a_cliente')
                        ->exists()) {
            return response()->json(['error' => 'Client already rated for this trip'], 400);
        }

        $request->validate([
            'puntuacion' => ['required', 'integer', 'min:1', 'max:5'],
            'comentario' => 'nullable|string|max:500',
        ]);

        $calificacion = Calificacion::create([
            'viaje_id' => $viaje->id,
            'calificador_id' => $user->id,
            'calificado_id' => $viaje->cliente_id,
            'puntuacion' => $request->puntuacion,
            'comentario' => $request->comentario,
            'tipo' => 'motorista_a_cliente',
        ]);

        return response()->json([
            'message' => 'Client rated successfully',
            'data' => $calificacion,
        ], 201);
    }
}
