<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .date { font-size: 14px; color: #666; }
        .section-title { font-size: 18px; font-weight: bold; margin-top: 20px; border-left: 4px solid #10b981; padding-left: 10px; }
        .stats-grid { width: 100%; margin-top: 20px; border-collapse: collapse; }
        .stats-grid td { width: 50%; padding: 15px; border: 1px solid #eee; }
        .stat-label { font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold; }
        .stat-value { font-size: 20px; font-weight: bold; color: #111827; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
        .status-table { width: 100%; margin-top: 15px; border-collapse: collapse; }
        .status-table th, .status-table td { padding: 10px; border: 1px solid #eee; text-align: left; }
        .status-table th { background-color: #f9fafb; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">MotoTX 🛵🇲🇱</div>
        <div style="font-size: 20px; margin-top: 5px;">Reporte de Operaciones Mensuales</div>
        <div class="date">Generado el: {{ $date }}</div>
    </div>

    <div class="section-title">Resumen de Indicadores Clave (KPIs)</div>
    <table class="stats-grid">
        <tr>
            <td>
                <div class="stat-label">Ingresos del Mes</div>
                <div class="stat-value">{{ number_format($ingresosMes) }} CFA</div>
            </td>
            <td>
                <div class="stat-label">Viajes Completados</div>
                <div class="stat-value">{{ $viajesMes }}</div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="stat-label">Motoristas Aprobados</div>
                <div class="stat-value">{{ $totalMotoristas }}</div>
            </td>
            <td>
                <div class="stat-label">Usuarios en la Plataforma</div>
                <div class="stat-value">{{ $usuariosActivos }}</div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="stat-label">Calificación Promedio</div>
                <div class="stat-value">{{ $ratingPromedio }} ⭐</div>
            </td>
            <td>
                <div class="stat-label">Estado de la Plataforma</div>
                <div class="stat-value" style="color: #10b981;">Activa</div>
            </td>
        </tr>
    </table>

    <div class="section-title">Distribución de Viajes por Estado</div>
    <table class="status-table">
        <thead>
            <tr>
                <th>Estado</th>
                <th>Total de Viajes</th>
            </tr>
        </thead>
        <tbody>
            @foreach($viajesPorEstado as $estado => $total)
            <tr>
                <td style="text-transform: capitalize;">{{ $estado }}</td>
                <td>{{ $total }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        © {{ date('Y') }} MotoTX Mali - Bamako. Todos los derechos reservados.
    </div>
</body>
</html>
