<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte Mensual - MotoTX</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
        }
        .meta {
            color: #666;
            font-size: 14px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }
        .metric-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            text-align: center;
        }
        .metric-value {
            font-size: 32px;
            font-weight: bold;
            color: #1e293b;
        }
        .metric-label {
            font-size: 14px;
            text-transform: uppercase;
            color: #64748b;
            letter-spacing: 1px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th, td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
        }
        th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: 600;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
        }
        @media print {
            body { padding: 0; }
            .no-print { display: none; }
            .metric-card { border: 1px solid #000; }
        }
        .btn-print {
            background: #2563eb;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="no-print" style="text-align: right;">
        <button onclick="window.print()" class="btn-print">🖨️ Imprimir / Guardar como PDF</button>
    </div>

    <div class="header">
        <div class="logo">MotoTX Bamako</div>
        <h1>Reporte Mensual de Operaciones</h1>
        <div class="meta">Periodo: {{ $month }}/{{ $year }} | Generado el: {{ now()->format('d/m/Y H:i') }}</div>
    </div>

    <div class="metrics-grid">
        <div class="metric-card">
            <div class="metric-value">{{ number_format($ingresos, 0, ',', '.') }} CFA</div>
            <div class="metric-label">Ingresos Totales</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">{{ $totalViajes }}</div>
            <div class="metric-label">Viajes Solicitados</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">{{ $completedViajes }}</div>
            <div class="metric-label">Viajes Completados</div>
        </div>
    </div>

    <h3>🏆 Top 5 Motoristas del Mes</h3>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Motorista</th>
                <th>Viajes Completados</th>
            </tr>
        </thead>
        <tbody>
            @foreach($topDrivers as $index => $driver)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $driver->motorista->name ?? 'Usuario Eliminado' }}</td>
                <td><strong>{{ $driver->total }}</strong></td>
            </tr>
            @endforeach
            @if(count($topDrivers) === 0)
            <tr>
                <td colspan="3" style="text-align: center; padding: 20px;">No hay datos suficientes para este periodo.</td>
            </tr>
            @endif
        </tbody>
    </table>

    <div class="footer">
        © {{ date('Y') }} MotoTX Technologies SARL. Documento Confidencial.
    </div>
</body>
</html>
