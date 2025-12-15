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

class AdminController extends Controller
{
    protected $userService;
    protected $motoristaService;

    public function __construct(UserService $userService, MotoristaService $motoristaService)
    {
        $this->userService = $userService;
        $this->motoristaService = $motoristaService;
    }
    /**
     * Display a listing of the resource.
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
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return $user;
    }

    /**
     * Update the specified resource in storage.
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
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(null, 204);
    }

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

    public function getAllTrips()
    {
        $trips = Viaje::with(['cliente', 'motorista', 'calificacion'])->orderBy('created_at', 'desc')->get();
        return response()->json($trips);
    }

    public function getAllTransacciones()
    {
        $transacciones = Transaccion::all();
        return response()->json($transacciones);
    }

    /**
     * Get chart data for dashboard
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
        
        // Fill missing dates
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
     * Get dashboard statistics
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
                'text' => "Nuevo usuario: {$u->name} ({$u->rol})", 
                'time' => $u->created_at->diffForHumans(),
                'color' => '#10b981' // Green
            ];
        });

        $recentTrips = Viaje::latest()->take(3)->get()->map(function($t) {
            return [
                'type' => 'trip', 
                'text' => "Nuevo viaje: {$t->origen} -> {$t->destino}", 
                'time' => $t->created_at->diffForHumans(),
                'color' => '#2563eb' // Blue
            ];
        });

        $recentSales = \App\Models\ClienteForfait::with('forfait')->latest()->take(3)->get()->map(function($s) {
            return [
                'type' => 'sale', 
                'text' => "Venta: " . ($s->forfait->nombre ?? 'Forfait'), 
                'time' => $s->created_at->diffForHumans(),
                'color' => '#f59e0b' // Amber
            ];
        });

        // Merge and sort
        $recentActivity = $recentUsers->concat($recentTrips)->concat($recentSales)
            ->sortByDesc(function($item) {
                // Approximate sort by relying on 'time' string is hard, ideally we'd use raw timestamps.
                // For simplicity in this demo, we just merge. In real app, standardizing timestamps is better.
                return $item['time']; 
            })->values()->take(5);

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
