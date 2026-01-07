<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Viaje
 *
 * [ES] Representa una solicitud de viaje o trayecto completado.
 *      Entidad central vinculando Clientes (Solicitante) y Motoristas (Proveedor).
 *      Almacena coordenadas GPS para enrutamiento y cálculo de distancia.
 *      Estados: 'solicitado', 'aceptado', 'en_curso', 'completado', 'cancelado'.
 *
 * [FR] Représente une demande de voyage ou un trajet terminé.
 *      Entité centrale reliant Clients (Demandeur) et Chauffeurs (Fournisseur).
 *      Stocke les coordonnées GPS pour le routage et le calcul de la distance.
 *      États : 'solicitado', 'aceptado', 'en_curso', 'completado', 'cancelado'.
 *
 * @package App\Models
 */
class Viaje extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'cliente_id',
        'motorista_id',
        'origen_lat',
        'origen_lng',
        'destino_lat',
        'destino_lng',
        'estado',
        'fecha_solicitud',
        'fecha_fin',
        'costo',
    ];

    /**
     * Relationship: Resulting Client user who requested the trip.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cliente()
    {
        return $this->belongsTo(User::class, 'cliente_id');
    }

    /**
     * Relationship: The Motorista user who accepted and performed the trip.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function motorista()
    {
        return $this->belongsTo(User::class, 'motorista_id');
    }

    /**
     * Relationship: The rating given by the client for this specific trip.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function calificacion()
    {
        return $this->hasOne(Calificacion::class, 'viaje_id');
    }
}
