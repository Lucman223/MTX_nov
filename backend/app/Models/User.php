<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject; // Import JWTSubject

/**
 * Class User
 *
 * [ES] Representa un usuario registrado en el sistema.
 *      El atributo 'rol' determina las capacidades (admin, motorista, cliente).
 *      Implementa JWTSubject para interfaz con paquete jwt-auth.
 *
 * [FR] Représente un utilisateur enregistré dans le système.
 *      L'attribut 'rol' détermine les capacités (admin, motorista, client).
 *      Implémente JWTSubject pour l'interface avec le package jwt-auth.
 *
 * @property int $id [ES] Identificador único [FR] Identifiant unique
 * @property string $name [ES] Nombre completo [FR] Nom complet
 * @property string $email [ES] Correo electrónico único [FR] Adresse email unique
 * @property string $password [ES] Contraseña hasheada [FR] Mot de passe haché
 * @property string $rol [ES] Rol del usuario: 'admin', 'motorista', 'cliente' [FR] Rôle de l'utilisateur
 *
 * @package App\Models
 */
class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'rol',
        'telefono',
        'foto_perfil',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     * Use the primary key of the model.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array of custom claims to be added to the JWT.
     * Can be used to embed roles or permissions directly in the token payload.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Relationship: A user (specifically a 'motorista') has one driver profile
     * containing vehicle and license details.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function motorista_perfil()
    {
        return $this->hasOne(MotoristaPerfil::class, 'usuario_id');
    }

    /**
     * Relationship: A user (specifically a 'cliente' or 'motorista' buying for themselves)
     * can have multiple subscription records.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function clienteForfaits()
    {
        return $this->hasMany(ClienteForfait::class, 'cliente_id');
    }
}
