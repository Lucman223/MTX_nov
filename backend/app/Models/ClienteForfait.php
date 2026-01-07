<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ClienteForfait
 *
 * [ES] Relación N:M entre Clientes y Forfaits, representando una suscripción activa o expirada.
 *      Controla el saldo de viajes restantes y fechas de vencimiento.
 *
 * [FR] Relation N:M entre Clients et Forfaits, représentant un abonnement actif ou expiré.
 *      Contrôle le solde des voyages restants et les dates d'expiration.
 *
 * @package App\Models
 */
class ClienteForfait extends Model
{
    protected $table = 'clientes_forfaits';

    protected $fillable = [
        'cliente_id',
        'forfait_id',
        'fecha_compra',
        'fecha_expiracion',
        'viajes_restantes',
        'estado',
    ];

    public function forfait()
    {
        return $this->belongsTo(Forfait::class, 'forfait_id');
    }

    public function cliente()
    {
        return $this->belongsTo(User::class, 'cliente_id');
    }
}
