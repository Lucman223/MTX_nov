<?php

namespace App\Http\Controllers\Viajes;

use App\Models\Viaje;

use App\Models\User;

use Illuminate\Http\Request;

use App\Http\Requests\Viajes\SolicitarViajeRequest;

use App\Http\Requests\Viajes\UpdateViajeStatusRequest;

use App\Services\ViajeService;
use App\Http\Controllers\Controller;



/**
 * Class ViajeController
 *
 * [ES] Maneja el ciclo de vida completo de un Viaje, desde la solicitud hasta su finalización.
 *      Gestiona la interacción entre Cliente (Solicitante) y Motorista (Proveedor).
 *      Usa WebSockets (vía Eventos) para notificar cambios de estado a las partes.
 *
 * [FR] Gère l'ensemble du cycle de vie d'un voyage, de la demande à l'achèvement.
 *      Gère l'interaction entre le Client (Demandeur) et le Chauffeur (Fournisseur).
 *      Utilise WebSockets (via événements) pour notifier les changements d'état aux parties.
 *
 * @package App\Http\Controllers\Viajes
 */
class ViajeController extends Controller
{
    /**
     * @var ViajeService Service encapsulating the business rules for trips.
     */
    protected $viajeService;

    /**
     * ViajeController constructor.
     *
     * @param ViajeService $viajeService Dependency injection.
     */
    public function __construct(ViajeService $viajeService)
    {
        $this->viajeService = $viajeService;
    }

    /**
     * [ES] Crea una nueva solicitud de viaje iniciada por un cliente.
     *      Emite un evento 'ViajeSolicitado' a los conductores cercanos.
     *
     * [FR] Crée une nouvelle demande de voyage initiée par un client.
     *      Diffuse un événement 'ViajeSolicitado' aux chauffeurs à proximité.
     *
     * @param SolicitarViajeRequest $request Validated GPS coordinates (origin/destination).
     * @return \Illuminate\Http\JsonResponse 201 Created with trip details.
     */
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
     * [ES] Recupera el historial de viajes completados para el usuario autenticado.
     *      Filtra resultados según el rol del usuario (Cliente vs Motorista).
     *
     * [FR] Récupère l'historique des voyages terminés pour l'utilisateur authentifié.
     *      Filtre les résultats selon le rôle de l'utilisateur (Client vs Chauffeur).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse Paginated list of trips.
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
     * [ES] Recupera información detallada sobre un viaje específico.
     *      Incluye verificación de seguridad para asegurar que solo las partes involucradas (o admin) puedan verla.
     *
     * [FR] Récupère des informations détaillées sur un voyage spécifique.
     *      Comprend une vérification de sécurité pour s'assurer que seules les parties impliquées (ou l'administrateur) peuvent les consulter.
     *
     * @param Request $request
     * @param int $id Trip ID.
     * @return \Illuminate\Http\JsonResponse Trip object or Error 403/404.
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

    /**
     * [ES] Devuelve una lista de viajes que están 'solicitados' y aún no asignados.
     *      Usado por el panel del conductor para ver viajes disponibles.
     *
     * [FR] Renvoie une liste de voyages qui sont 'demandés' (solicitado) et non encore attribués.
     *      Utilisé par le tableau de bord du chauffeur pour voir les trajets disponibles.
     *
     * @return \Illuminate\Http\JsonResponse List of available trips.
     */
    public function getSolicitedTrips()
    {
        // Only return trips that are 'solicitado' and have no motorista assigned yet
        $solicitedTrips = Viaje::where('estado', 'solicitado')
                               ->whereNull('motorista_id')
                               ->orderBy('created_at', 'desc')
                               ->get();

        return response()->json($solicitedTrips);
    }

    /**
     * [ES] Identifica el viaje activo actual para el usuario.
     *      Para Motoristas: Su viaje aceptado o en curso.
     *      Para Clientes: Su viaje solicitado, aceptado o en curso.
     *      Incluye lógica para forzar calificación en viajes completados no calificados.
     *
     * [FR] Identifie le voyage actif actuel pour l'utilisateur.
     *      Pour Chauffeurs : Leur voyage accepté ou en cours.
     *      Pour Clients : Leur voyage demandé, accepté ou en cours.
     *      Comprend une logique pour forcer la notation sur les voyages terminés non notés.
     *
     * @return \Illuminate\Http\JsonResponse Active trip object or null.
     */
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

    /**
     * [ES] Permite a un motorista aceptar un viaje solicitado.
     *      Emite 'ViajeAceptado' al cliente.
     *
     * [FR] Permet à un chauffeur d'accepter un voyage demandé.
     *      Diffuse 'ViajeAceptado' au client.
     *
     * @param Request $request
     * @param Viaje $viaje The trip to accept.
     * @return \Illuminate\Http\JsonResponse Updated trip with 'aceptado' status.
     */
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

    /**
     * [ES] Actualiza el estado de un viaje en curso (ej. a 'en_curso' o 'completado').
     *      Emite 'ViajeActualizado'.
     *
     * [FR] Met à jour l'état d'un voyage en cours (ex. vers 'en_curso' ou 'completado').
     *      Diffuse 'ViajeActualizado'.
     *
     * @param UpdateViajeStatusRequest $request Validated status.
     * @param Viaje $viaje The trip instance.
     * @return \Illuminate\Http\JsonResponse Updated trip.
     */
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

    /**
     * [ES] Calcula las ganancias y estadísticas de viajes del conductor para el día y mes actual.
     *      Usa un modelo de precios fijo (ej. 1000 CFA/viaje) para fines de presentación.
     *
     * [FR] Calcule les revenus et les statistiques de voyage du chauffeur pour la journée et le mois en cours.
     *      Utilise un modèle de prix fixe (ex. 1000 CFA/voyage) à des fins de présentation.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse Stats object.
     */
    public function getDriverStats(Request $request)
    {
        $user = $request->user();
        if ($user->rol !== 'motorista') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $today = now()->startOfDay();
        $month = now()->startOfMonth();

        $todayTrips = Viaje::where('motorista_id', $user->id)
            ->where('estado', 'completado')
            ->where('updated_at', '>=', $today)
            ->count();

        $monthTrips = Viaje::where('motorista_id', $user->id)
            ->where('estado', 'completado')
            ->where('updated_at', '>=', $month)
            ->count();

        // Business Logic: 1000 CFA per trip (Presentation Model)
        $avgPrice = 1000;

        return response()->json([
            'today_trips' => $todayTrips,
            'today_earnings' => $todayTrips * $avgPrice,
            'month_earnings' => $monthTrips * $avgPrice,
            'currency' => 'CFA',
            'commission_saved' => ($todayTrips * $avgPrice) * 0.20 // Show them what they saved (20% typical commission)
        ]);
    }
}

