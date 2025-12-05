<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaccion extends Model
{
    protected $fillable = [
        'usuario_id',
        'forfait_id',
        'monto',
        'moneda',
        'tipo',
        'estado',
        'metodo_pago',
        'fecha_transaccion',
        'pasarela_pago_id',
        'referencia_externa',
        'descripcion',
    ];
}
