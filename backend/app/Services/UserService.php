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
            'password' => $data['password'],
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
            $user->password = $data['password'];
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
            'password' => \Illuminate\Support\Str::random(32), // Scramble - Cast will handle hashing
        ]);

        // 3. Execute Soft Delete
        $user->delete();
    }
}
