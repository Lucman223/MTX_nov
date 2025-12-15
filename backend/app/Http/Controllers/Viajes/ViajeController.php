<?php

namespace App\Http\Controllers\Viajes;

use App\Models\Viaje;

use App\Models\User;

use Illuminate\Http\Request;

use App\Http\Requests\Viajes\SolicitarViajeRequest;

use App\Http\Requests\Viajes\UpdateViajeStatusRequest;

use App\Services\ViajeService;



use App\Events\ViajeSolicitado;
use App\Events\ViajeAceptado;
use App\Events\ViajeActualizado;
use App\Http\Controllers\Controller;

class ViajeController extends Controller
{
    protected $viajeService;

    public function __construct(ViajeService $viajeService)
    {
        $this->viajeService = $viajeService;
    }

    public function solicitarViaje(SolicitarViajeRequest $request)
    {
        $user = auth()->user();

        try {
            $viaje = $this->viajeService->solicitarViaje(
                $user, 
                $request->origen_lat, 
                $request->origen_lng,
                $request->destino_lat,
                $request->destino_lng
            );

            // Broadcast new trip request to motoristas
            ViajeSolicitado::dispatch($viaje);

            return response()->json([
                'message' => 'Trip requested successfully',
                'data' => $viaje,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Get trip history for the authenticated user
     */
    public function getHistory(Request $request)
    {
        $user = $request->user();
        
        $query = Viaje::with(['cliente', 'motorista', 'calificacion'])
            ->where('estado', 'completado')
            ->orderBy('updated_at', 'desc');

        if ($user->rol === 'cliente') {
            $query->where('cliente_id', $user->id);
        } elseif ($user->rol === 'motorista') {
            $query->where('motorista_id', $user->id);
        }

        $viajes = $query->paginate(10);

        return response()->json($viajes, 200);
    }

    /**
     * Get trip details by ID
     */
    public function getTripDetails(Request $request, $id)
    {
        $user = $request->user();
        
        $viaje = Viaje::with(['cliente', 'motorista', 'calificacion'])->find($id);

        if (!$viaje) {
            return response()->json(['error' => 'Viaje no encontrado'], 404);
        }

        // Verify user has access to this trip
        if ($viaje->cliente_id !== $user->id && $viaje->motorista_id !== $user->id && $user->rol !== 'admin') {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return response()->json($viaje, 200);
    }


    public function getSolicitedTrips()
    {
        // Only return trips that are 'solicitado' and have no motorista assigned yet
        $solicitedTrips = Viaje::where('estado', 'solicitado')
                               ->whereNull('motorista_id')
                               ->orderBy('created_at', 'desc')
                               ->get();

        return response()->json($solicitedTrips);
    }

    public function getCurrentTrip()
    {
        $user = auth()->user();
        
        if ($user->rol === 'motorista') {
            $currentTrip = Viaje::where('motorista_id', $user->id)
                                ->whereIn('estado', ['aceptado', 'en_curso'])
                                ->latest() // Prioritize newest
                                ->first();
        } else {
            // Client: Return active trips OR completed trips that haven't been rated yet
            $currentTrip = Viaje::where('cliente_id', $user->id)
                                ->where(function($query) {
                                    $query->whereIn('estado', ['solicitado', 'aceptado', 'en_curso'])
                                          ->orWhere(function($q) {
                                              $q->where('estado', 'completado')
                                                ->doesntHave('calificacion');
                                          });
                                })
                                ->with(['motorista.motorista_perfil'])
                                ->latest() // Prioritize newest
                                ->first();
        }

        if ($currentTrip) {
            $currentTrip->refresh();
            return response()->json($currentTrip);
        }

        return response()->json(null);
    }



    public function acceptTrip(Request $request, Viaje $viaje)

    {

        $motorista = auth()->user();



        try {

            $acceptedViaje = $this->viajeService->acceptTrip($motorista, $viaje);

            // Notify client that trip was accepted
            ViajeAceptado::dispatch($acceptedViaje);

            return response()->json([

                'message' => 'Trip accepted successfully',

                'data' => $acceptedViaje,

            ]);

        } catch (\Exception $e) {

            return response()->json(['error' => $e->getMessage()], 400);

        }

    }



    public function updateTripStatus(UpdateViajeStatusRequest $request, Viaje $viaje)

    {

        $motorista = auth()->user();



        try {

            $updatedViaje = $this->viajeService->updateTripStatus($motorista, $viaje, $request->estado);

            // Notify client of status change
            ViajeActualizado::dispatch($updatedViaje);

            return response()->json([

                'message' => "Trip status updated to {$request->estado}",

                'data' => $updatedViaje,

            ]);

        } catch (\Exception $e) {

            return response()->json(['error' => $e->getMessage()], 400);

        }

    }

}
