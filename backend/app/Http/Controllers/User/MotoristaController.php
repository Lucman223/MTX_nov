<?php

namespace App\Http\Controllers\User;

use App\Models\MotoristaPerfil;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Events\MotoristaLocationUpdated; // Import the event
use App\Http\Requests\User\UpdateMotoristaStatusRequest;
use App\Http\Requests\User\UpdateMotoristaLocationRequest;
use App\Services\MotoristaService;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MotoristaController extends Controller
{
    protected $motoristaService;

    public function __construct(MotoristaService $motoristaService)
    {
        $this->motoristaService = $motoristaService;
    }
    public function updateStatus(UpdateMotoristaStatusRequest $request)
    {
        $user = auth()->user();

        if ($user->rol !== 'motorista') {
            return response()->json(['error' => 'Forbidden: Only motoristas can update their status'], 403);
        }

        try {
            $motoristaPerfil = $this->motoristaService->updateStatus($user, $request->estado_actual);
            return response()->json([
                'message' => 'Motorista status updated successfully',
                'data' => $motoristaPerfil,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Motorista profile not found'], 404);
        }
    }

    public function updateLocation(UpdateMotoristaLocationRequest $request)
    {
        $user = auth()->user();

        if ($user->rol !== 'motorista') {
            return response()->json(['error' => 'Forbidden: Only motoristas can update their location'], 403);
        }

        try {
            $motoristaPerfil = $this->motoristaService->updateLocation($user, $request->latitude, $request->longitude);
            return response()->json([
                'message' => 'Motorista location updated successfully',
                'data' => $motoristaPerfil,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Motorista profile not found'], 404);
        }
    }
}
