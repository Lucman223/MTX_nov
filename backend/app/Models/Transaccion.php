<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Transaccion
 *
 * [ES] Registro contable de todos los movimientos financieros en la plataforma.
 *      Vincula usuarios, forfaits y pasarelas de pago.
 *
 * [FR] Registre comptable de tous les mouvements financiers sur la plateforme.
 *      Relie les utilisateurs, les forfaits et les passerelles de paiement.
 *
 * @package App\Models
 */
class Transaccion extends Model
{
    protected $table = 'transacciones';

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
