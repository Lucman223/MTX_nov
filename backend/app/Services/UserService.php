<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function createUser(array $data): User
    {
        $documentoPath = null;
        if (isset($data['documento_identidad']) && $data['documento_identidad'] instanceof \Illuminate\Http\UploadedFile) {
            $documentoPath = $data['documento_identidad']->store('documents/identidad', 'public');
        }

        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            // [ES] Forzamos el uso de Argon2id nativo para nuevos registros
            // [FR] Nous forçons l'utilisation d'Argon2id natif pour les nouveaux enregistrements
            'password' => password_hash($data['password'], PASSWORD_ARGON2ID, [
                'memory_cost' => 65536,
                'time_cost' => 4,
                'threads' => 1
            ]),
            'rol' => $data['rol'],
            'telefono' => $data['telefono'] ?? null,
            'documento_identidad_path' => $documentoPath,
        ]);
    }

    public function updateProfile(User $user, array $data): User
    {
        $user->name = $data['name'] ?? $user->name;
        $user->email = $data['email'] ?? $user->email;
        $user->rol = $data['rol'] ?? $user->rol;
        $user->telefono = $data['telefono'] ?? $user->telefono;
        $user->foto_perfil = $data['foto_perfil'] ?? $user->foto_perfil;

        if (isset($data['password'])) {
            // [ES] Actualización manual usando Argon2id nativo
            $user->password = password_hash($data['password'], PASSWORD_ARGON2ID, [
                'memory_cost' => 65536,
                'time_cost' => 4,
                'threads' => 1
            ]);
        }

        $user->save();

        return $user;
    }
    /**
     * Delete user account with RGPD compliance (Soft Delete + Anonymization).
     *
     * @param User $user
     * @return void
     */
    public function deleteUser(User $user): void
    {
        // 1. Clear related profile data if motorista
        if ($user->rol === 'motorista' && $user->motorista_perfil) {
            $user->motorista_perfil->update([
                'matricula' => 'DELETED',
                'documento_licencia_path' => null,
                'latitud_actual' => null,
                'longitud_actual' => null,
            ]);
        }

        // 2. Anonymize personal data in User model
        $user->update([
            'name' => null, // Name set to NULL as requested
            'email' => 'deleted-' . $user->id . '@local', // Pattern: deleted-ID@local
            'telefono' => null,
            'foto_perfil' => null,
            'documento_identidad_path' => null,
            'password' => password_hash(\Illuminate\Support\Str::random(32), PASSWORD_ARGON2ID), // Scramble
        ]);

        // 3. Execute Soft Delete
        $user->delete();
    }
}
