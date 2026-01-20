<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function createUser(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'rol' => $data['rol'],
            'telefono' => $data['telefono'] ?? null,
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
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return $user;
    }
}
