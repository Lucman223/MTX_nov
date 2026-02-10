<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Viaje;
use App\Models\ClienteForfait;
use App\Models\Calificacion;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class AdminReportController extends Controller
{
    /**
     * [ES] Genera un reporte PDF con las estadísticas generales de la plataforma.
     * [FR] Génère un rapport PDF avec les statistiques générales de la plateforme.
     *
     * @return \Illuminate\Http\Response
     */
    public function exportMonthlyReport()
    {
        // Total motoristas aprobados
        $totalMotoristas = User::where('rol', 'motorista')
            ->whereHas('motorista_perfil', function($q) {
                $q->where('estado_validacion', 'aprobado');
            })->count();

        // Viajes completados este mes
        $viajesMes = Viaje::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->where('estado', 'completado')
            ->count();

        // Ingresos del mes (forfaits vendidos)
        $ingresosMes = ClienteForfait::whereMonth('fecha_compra', now()->month)
            ->whereYear('fecha_compra', now()->year)
            ->join('forfaits', 'clientes_forfaits.forfait_id', '=', 'forfaits.id')
            ->sum('forfaits.precio');

        // Usuarios totales
        $usuariosActivos = User::whereIn('rol', ['cliente', 'motorista'])->count();

        // Viajes por estado
        $viajesPorEstado = Viaje::select('estado', DB::raw('count(*) as total'))
            ->groupBy('estado')
            ->pluck('total', 'estado');

        // Rating promedio
        $ratingPromedio = Calificacion::avg('puntuacion');

        $data = [
            'date' => now()->format('d/m/Y'),
            'totalMotoristas' => $totalMotoristas,
            'viajesMes' => $viajesMes,
            'ingresosMes' => $ingresosMes ?? 0,
            'usuariosActivos' => $usuariosActivos,
            'viajesPorEstado' => $viajesPorEstado,
            'ratingPromedio' => $ratingPromedio ? round($ratingPromedio, 1) : 'N/A',
            'title' => 'MotoTX - Reporte de Operaciones'
        ];

        $pdf = Pdf::loadView('reports.monthly', $data);
        
        return $pdf->download('MotoTX_Reporte_' . now()->format('Y_m_d') . '.pdf');
    }
}
