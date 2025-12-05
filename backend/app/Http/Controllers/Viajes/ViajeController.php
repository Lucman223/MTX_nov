<?php

namespace App\Http\Controllers\Viajes;

use App\Models\Viaje;

use App\Models\User;

use Illuminate\Http\Request;

use App\Http\Requests\Viajes\SolicitarViajeRequest;

use App\Http\Requests\Viajes\UpdateViajeStatusRequest;

use App\Services\ViajeService;



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

            $viaje = $this->viajeService->solicitarViaje($user, $request->origen_lat, $request->origen_lng);

            return response()->json([

                'message' => 'Trip requested successfully',

                'data' => $viaje,

            ], 201);

        } catch (\Exception $e) {

            return response()->json(['error' => $e->getMessage()], 400);

        }

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



        try {

            $acceptedViaje = $this->viajeService->acceptTrip($motorista, $viaje);

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

            return response()->json([

                'message' => "Trip status updated to {$request->estado}",

                'data' => $updatedViaje,

            ]);

        } catch (\Exception $e) {

            return response()->json(['error' => $e->getMessage()], 400);

        }

    }

}
