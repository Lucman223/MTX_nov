<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class PlanMotorista
 *
 * [ES] Define los planes de suscripción específicos para conductores (ej. VIP, Estándar).
 *      Determina beneficios como menor comisión o prioridad en asignación.
 *
 * [FR] Définit les plans d'abonnement spécifiques pour les chauffeurs (ex. VIP, Standard).
 *      Détermine les avantages comme une commission réduite ou une priorité dans l'attribution.
 *
 * @package App\Models
 */
class PlanMotorista extends Model
{
    protected $table = 'planes_motorista';

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'dias_validez',
        'es_vip',
    ];
}
