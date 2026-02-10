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
        // Anonymize personal data
        $user->name = 'Deleted User ' . $user->id;
        $user->email = 'deleted_' . $user->id . '_' . time() . '@anon.com';
        $user->telefono = null;
        $user->foto_perfil = null;
        $user->password = \Illuminate\Support\Str::random(32); // Scramble password
        $user->save();

        // Soft delete the user
        $user->delete();
    }
}
