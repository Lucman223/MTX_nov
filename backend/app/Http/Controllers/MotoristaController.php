<?php

namespace App\Http\Controllers;

use App\Models\MotoristaPerfil;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MotoristaController extends Controller
{
    public function updateStatus(Request $request)
    {
        $user = auth()->user();

        if ($user->rol !== 'motorista') {
            return response()->json(['error' => 'Forbidden: Only motoristas can update their status'], 403);
        }

        $request->validate([
            'estado_actual' => ['required', Rule::in(['activo', 'inactivo'])],
        ]);

        $motoristaPerfil = MotoristaPerfil::where('usuario_id', $user->id)->first();

        if (!$motoristaPerfil) {
            return response()->json(['error' => 'Motorista profile not found'], 404);
        }

        $motoristaPerfil->update([
            'estado_actual' => $request->estado_actual,
        ]);

        return response()->json([
            'message' => 'Motorista status updated successfully',
            'data' => $motoristaPerfil,
        ]);
    }

    public function updateLocation(Request $request)
    {
        $user = auth()->user();

        if ($user->rol !== 'motorista') {
            return response()->json(['error' => 'Forbidden: Only motoristas can update their location'], 403);
        }

        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $motoristaPerfil = MotoristaPerfil::where('usuario_id', $user->id)->first();

        if (!$motoristaPerfil) {
            return response()->json(['error' => 'Motorista profile not found'], 404);
        }

        $motoristaPerfil->update([
            'current_lat' => $request->latitude,
            'current_lng' => $request->longitude,
        ]);

        return response()->json([
            'message' => 'Motorista location updated successfully',
            'data' => $motoristaPerfil,
        ]);
    }
}
