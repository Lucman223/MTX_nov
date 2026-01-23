<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Viaje;
use App\Models\Transaccion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Genera un reporte financiero y operativo mensual.
     */
    public function generateMonthlyReport(Request $request)
    {
        // Default to current month if not specified
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        // Data Gathering
        $totalViajes = Viaje::whereYear('created_at', $year)
                            ->whereMonth('created_at', $month)
                            ->count();

        $completedViajes = Viaje::whereYear('created_at', $year)
                                ->whereMonth('created_at', $month)
                                ->where('estado', 'completado')
                                ->count();

        $ingresos = Transaccion::whereYear('created_at', $year)
                               ->whereMonth('created_at', $month)
                               ->where('estado', 'completado')
                               ->sum('monto');

        $topDrivers = Viaje::select('motorista_id', DB::raw('count(*) as total'))
                           ->whereYear('created_at', $year)
                           ->whereMonth('created_at', $month)
                           ->where('estado', 'completado')
                           ->whereNotNull('motorista_id')
                           ->groupBy('motorista_id')
                           ->orderByDesc('total')
                           ->limit(5)
                           ->with('motorista')
                           ->get();

        // Return Printer-Friendly View
        return view('reports.monthly', compact('totalViajes', 'completedViajes', 'ingresos', 'topDrivers', 'month', 'year'));
    }
}
