<?php

namespace App\Http\Controllers\Viajes;

use App\Models\Viaje;
use App\Models\Calificacion;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RatingController extends Controller
{
    /**
     * Submit a rating for a completed trip
     */
    public function submitRating(Request $request, $tripId)
    {
        $user = $request->user();

        // Validate request
        $validated = $request->validate([
            'puntuacion' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:500'
        ]);

        // Find the trip
        $viaje = Viaje::find($tripId);

        if (!$viaje) {
            return response()->json(['error' => 'Viaje no encontrado'], 404);
        }

        // Determine type of rating
        $type = $request->input('tipo', 'cliente_a_motorista'); // 'cliente_a_motorista' or 'motorista_a_cliente'

        $calificadorId = $user->id;
        $calificadoId = null;

        if ($type === 'cliente_a_motorista') {
            // Verify user is the client
            if ($viaje->cliente_id !== $user->id) {
                return response()->json(['error' => 'Solo el cliente puede calificar al motorista'], 403);
            }
            $calificadoId = $viaje->motorista_id;
        } else if ($type === 'motorista_a_cliente') {
            // Verify user is the motorista
            if ($viaje->motorista_id !== $user->id) {
                return response()->json(['error' => 'Solo el motorista puede calificar al cliente'], 403);
            }
            $calificadoId = $viaje->cliente_id;
        } else {
            return response()->json(['error' => 'Tipo de calificación inválido'], 400);
        }

        // Check if THIS specific rating already exists (A rated B)
        $existingRating = Calificacion::where('viaje_id', $tripId)
            ->where('calificador_id', $calificadorId)
            ->first();

        if ($existingRating) {
            return response()->json(['error' => 'Ya has calificado este viaje'], 400);
        }

        // Create rating
        $calificacion = Calificacion::create([
            'viaje_id' => $tripId,
            'motorista_id' => $viaje->motorista_id,
            'cliente_id' => $viaje->cliente_id,
            'calificador_id' => $calificadorId, // Who is rating
            'calificado_id' => $calificadoId,   // Who is being rated
            'puntuacion' => $validated['puntuacion'],
            'comentario' => $validated['comentario'] ?? null
        ]);

        return response()->json([
            'message' => 'Calificación enviada con éxito',
            'calificacion' => $calificacion
        ], 201);
    }

    /**
     * Get ratings for a specific motorista
     */
    public function getMotoristaRatings($motoristaId)
    {
        $ratings = Calificacion::with(['cliente', 'viaje'])
            ->where('motorista_id', $motoristaId)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $average = Calificacion::where('motorista_id', $motoristaId)->avg('puntuacion');

        return response()->json([
            'ratings' => $ratings,
            'average' => round($average, 2)
        ], 200);
    }
}
