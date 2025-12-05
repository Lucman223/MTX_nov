<?php

namespace App\Http\Controllers\Viajes;

use App\Models\Viaje;
use Illuminate\Http\Request;
use App\Http\Requests\Viajes\RateMotoristaRequest;
use App\Http\Requests\Viajes\RateClienteRequest;
use App\Services\CalificacionService;

class CalificacionController extends Controller
{
    protected $calificacionService;

    public function __construct(CalificacionService $calificacionService)
    {
        $this->calificacionService = $calificacionService;
    }

    public function rateMotorista(RateMotoristaRequest $request, Viaje $viaje)
    {
        $user = auth()->user();

        try {
            $calificacion = $this->calificacionService->rateMotorista($user, $viaje, $request->puntuacion, $request->comentario);
            return response()->json(
                [
                    'message' => 'Motorista rated successfully',
                    'data' => $calificacion,
                ],
                201
            );
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function rateCliente(RateClienteRequest $request, Viaje $viaje)
    {
        $user = auth()->user();

        try {
            $calificacion = $this->calificacionService->rateCliente($user, $viaje, $request->puntuacion, $request->comentario);
            return response()->json([
                'message' => 'Client rated successfully',
                'data' => $calificacion,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
