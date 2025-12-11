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

        // Verify user is the client of this trip
        if ($viaje->cliente_id !== $user->id) {
            return response()->json(['error' => 'Solo el cliente puede calificar el viaje'], 403);
        }

        // Verify trip is completed
        if ($viaje->estado !== 'completado') {
            return response()->json(['error' => 'Solo se pueden calificar viajes completados'], 400);
        }

        // Check if already rated
        $existingRating = Calificacion::where('viaje_id', $tripId)->first();
        if ($existingRating) {
            return response()->json(['error' => 'Este viaje ya ha sido calificado'], 400);
        }

        // Create rating
        $calificacion = Calificacion::create([
            'viaje_id' => $tripId,
            'motorista_id' => $viaje->motorista_id,
            'cliente_id' => $user->id,
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
