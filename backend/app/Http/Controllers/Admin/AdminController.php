<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Models\MotoristaPerfil; // Import MotoristaPerfil
use App\Models\Viaje; // Import Viaje
use App\Models\Transaccion; // Import Transaccion
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Requests\Admin\UpdateMotoristaStatusRequest;
use App\Services\UserService;
use App\Services\MotoristaService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Controllers\Controller;

/**
 * Class AdminController
 *
 * [ES] Comando central para los administradores de la plataforma.
 * Maneja la gestión de usuarios, estadísticas del sistema, datos para gráficos
 * y procesos críticos de validación para motoristas.
 *
 * [FR] Commande centrale pour les administrateurs de la plateforme.
 * Gère la gestion des utilisateurs, les statistiques du système, l'agrégation des données graphiques
 * et les processus de validation critiques pour les chauffeurs (motoristas).
 *
 * @package App\Http\Controllers\Admin
 */
class AdminController extends Controller
{
    /**
     * @var UserService
     * [ES] Servicio para operaciones generales de usuario.
     * [FR] Service pour les opérations générales sur les utilisateurs.
     */
    protected $userService;

    /**
     * @var MotoristaService
     * [ES] Servicio especializado en lógica de motoristas y validación de perfiles.
     * [FR] Service spécialisé dans la logique des chauffeurs et la validation des profils.
     */
    protected $motoristaService;

    /**
     * AdminController constructor.
     *
     * @param UserService $userService
     * @param MotoristaService $motoristaService
     */
    public function __construct(UserService $userService, MotoristaService $motoristaService)
    {
        $this->userService = $userService;
        $this->motoristaService = $motoristaService;
    }

    /**
     * [ES] Muestra un listado de usuarios, opcionalmente filtrado por rol.
     * [FR] Affiche une liste d'utilisateurs, filtrée optionnellement par rôle.
     *
     * @param Request $request [ES] Puede contener el parámetro 'rol'. / [FR] Peut contenir le paramètre 'rol'.
     * @return \Illuminate\Database\Eloquent\Collection Collection of users.
     */
    public function index(Request $request)
    {
        $query = User::with('motorista_perfil');

        if ($request->has('rol')) {
            $query->where('rol', $request->rol);
        }

        return $query->get();
    }

    /**
     * [ES] Muestra la información detallada del usuario especificado.
     * [FR] Affiche les informations détaillées de l'utilisateur spécifié.
     *
     * @param User $user
     * @return User
     */
    public function show(User $user)
    {
        return $user;
    }

    /**
     * [ES] Actualiza los datos del perfil del usuario especificado.
     * [FR] Met à jour les données de profil de l'utilisateur spécifié.
     *
     * @param UpdateUserRequest $request
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $updatedUser = $this->userService->updateProfile($user, $request->validated());

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $updatedUser,
        ]);
    }

    /**
     * [ES] Elimina al usuario especificado del sistema.
     * [FR] Supprime l'utilisateur spécifié du système.
     *
     * @param User $user
     * @return \Illuminate\Http\JsonResponse 204 No Content
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(null, 204);
    }

    /**
     * [ES] Actualiza el estado de validación de un motorista (ej. aprobar o rechazar documentos).
     * [FR] Met à jour le statut de validation d'un chauffeur (ex. approuver ou rejeter des documents).
     *
     * @param UpdateMotoristaStatusRequest $request
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateMotoristaStatus(UpdateMotoristaStatusRequest $request, User $user)
    {
        if ($user->rol !== 'motorista') {
            return response()->json(['error' => 'User is not a motorista'], 400);
        }

        try {
            $motoristaPerfil = $this->motoristaService->updateValidationStatus($user, $request->estado_validacion);
            return response()->json([
                'message' => 'Motorista validation status updated successfully',
                'data' => $motoristaPerfil,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Motorista profile not found'], 404);
        }
    }

    /**
     * [ES] Recupera todos los viajes en el sistema para revisión administrativa.
     *      Incluye relaciones: cliente, motorista y calificación.
     * [FR] Récupère tous les voyages dans le système pour examen administratif.
     *      Inclut les relations : client, chauffeur et notation.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllTrips()
    {
        $trips = Viaje::with(['cliente', 'motorista', 'calificacion'])->orderBy('created_at', 'desc')->get();
        return response()->json($trips);
    }

    /**
     * [ES] Recupera todas las transacciones financieras registradas en el sistema.
     * [FR] Récupère toutes les transactions financières enregistrées dans le système.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllTransacciones()
    {
        $transacciones = Transaccion::all();
        return response()->json($transacciones);
    }

    /**
     * [ES] Agrega datos para los gráficos del panel de administración.
     *      Calcula ingresos diarios y conteo de viajes para el período solicitado.
     * [FR] Agrège les données pour les graphiques du tableau de bord d'administration.
     *      Calcule les revenus quotidiens et le nombre de voyages pour la période demandée.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getChartData(Request $request)
    {
        $days = $request->get('days', 30);
        $startDate = now()->subDays($days);

        // Ingresos por día (Forfaits + Comisiones si hubiera)
        $ingresos = \App\Models\ClienteForfait::where('fecha_compra', '>=', $startDate)
            ->join('forfaits', 'clientes_forfaits.forfait_id', '=', 'forfaits.id')
            ->selectRaw('DATE(fecha_compra) as date, SUM(forfaits.precio) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Viajes por día
        $viajes = Viaje::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, count(*) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Fill missing dates logic
        $chartData = [];
        $current = $startDate->copy();
        $end = now();

        while ($current <= $end) {
            $dateStr = $current->format('Y-m-d');

            $ingresoDia = $ingresos->firstWhere('date', $dateStr);
            $viajeDia = $viajes->firstWhere('date', $dateStr);

            $chartData[] = [
                'date' => $current->format('d/m'),
                'fullDate' => $dateStr,
                'ingresos' => $ingresoDia ? (float)$ingresoDia->total : 0,
                'viajes' => $viajeDia ? (int)$viajeDia->total : 0,
            ];

            $current->addDay();
        }

        return response()->json($chartData);
    }

    /**
     * [ES] Calcula Indicadores Clave de Rendimiento (KPIs) para el Dashboard de Admin.
     *      Incluye: Total Motoristas, Viajes Hoy, Ingresos Mensuales, Usuarios Activos, Actividad Reciente.
     * [FR] Calcule les Indicateurs Clés de Performance (KPI) pour le Tableau de Bord Admin.
     *      Inclus : Total Chauffeurs, Voyages Aujourd'hui, Revenus Mensuels, Utilisateurs Actifs, Activité Récente.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStatistics()
    {
        // Total motoristas aprobados
        $totalMotoristas = User::where('rol', 'motorista')
            ->whereHas('motorista_perfil', function($q) {
                $q->where('estado_validacion', 'aprobado');
            })->count();

        // Viajes hoy
        $viajesHoy = Viaje::whereDate('created_at', today())
            ->where('estado', 'completado')
            ->count();

        // Ingresos del mes (forfaits vendidos)
        $ingresosMes = \App\Models\ClienteForfait::whereMonth('fecha_compra', now()->month)
            ->whereYear('fecha_compra', now()->year)
            ->join('forfaits', 'clientes_forfaits.forfait_id', '=', 'forfaits.id')
            ->sum('forfaits.precio');

        // Usuarios activos (clientes + motoristas)
        $usuariosActivos = User::whereIn('rol', ['cliente', 'motorista'])->count();

        // Viajes por estado
        $viajesPorEstado = Viaje::select('estado', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
            ->groupBy('estado')
            ->pluck('total', 'estado');

        // Rating promedio
        $ratingPromedio = \App\Models\Calificacion::avg('puntuacion');

        // Motoristas pendientes
        $motoristasPendientes = User::where('rol', 'motorista')
            ->whereHas('motorista_perfil', function($q) {
                $q->where('estado_validacion', 'pendiente');
            })->count();

        // Viajes totales
        $viajesTotales = Viaje::count();

        // Actividad Reciente (Synthesized)
        $recentUsers = User::latest()->take(3)->get()->map(function($u) {
            return [
                'type' => 'user',
                'key' => 'admin_dashboard.activity.new_user',
                'params' => ['name' => $u->name, 'role' => $u->rol],
                'time' => $u->created_at->toISOString(),
                'color' => '#10b981' // Green
            ];
        });

        $recentTrips = Viaje::latest()->take(3)->get()->map(function($t) {
            return [
                'type' => 'trip',
                'key' => 'admin_dashboard.activity.new_trip',
                'params' => ['origin' => $t->origen, 'destination' => $t->destino],
                'time' => $t->created_at->toISOString(),
                'color' => '#2563eb' // Blue
            ];
        });

        $recentSales = \App\Models\ClienteForfait::with('forfait')->latest()->take(3)->get()->map(function($s) {
            return [
                'type' => 'sale',
                'key' => 'admin_dashboard.activity.sale',
                'params' => ['name' => $s->forfait->nombre ?? 'Forfait'],
                'time' => $s->created_at->toISOString(),
                'color' => '#f59e0b' // Amber
            ];
        });

        // Merge and sort by raw time first
        $recentActivity = $recentUsers->concat($recentTrips)->concat($recentSales)
            ->sortByDesc('time')
            ->values()
            ->take(5);

        return response()->json([
            'totalMotoristas' => $totalMotoristas,
            'viajesHoy' => $viajesHoy,
            'ingresosMes' => $ingresosMes ?? 0,
            'usuariosActivos' => $usuariosActivos,
            'viajesPorEstado' => $viajesPorEstado,
            'ratingPromedio' => $ratingPromedio ? round($ratingPromedio, 1) : 0,
            'motoristasPendientes' => $motoristasPendientes,
            'viajesTotales' => $viajesTotales,
            'recentActivity' => $recentActivity
        ]);
    }
}
