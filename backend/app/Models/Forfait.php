<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Forfait
 *
 * [ES] Define los planes de suscripción (paquetes de viajes) disponibles para los clientes.
 *      Contiene reglas de negocio como precio, validez y cantidad de viajes.
 *
 * [FR] Définit les plans d'abonnement (forfaits de voyage) disponibles pour les clients.
 *      Contient des règles métier telles que le prix, la validité et le nombre de voyages.
 *
 * @package App\Models
 */
class Forfait extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'viajes_incluidos',
        'dias_validez',
        'estado',
    ];
}
