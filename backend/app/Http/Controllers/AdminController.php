<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\MotoristaPerfil; // Import MotoristaPerfil
use App\Models\Viaje; // Import Viaje
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return User::all();
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return $user;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|string|min:8|confirmed',
            'rol' => ['sometimes', Rule::in(['cliente', 'motorista', 'admin'])],
        ]);

        $user->name = $request->input('name', $user->name);
        $user->email = $request->input('email', $user->email);
        $user->rol = $request->input('rol', $user->rol);

        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(null, 204);
    }

    public function updateMotoristaStatus(Request $request, User $user)
    {
        if ($user->rol !== 'motorista') {
            return response()->json(['error' => 'User is not a motorista'], 400);
        }

        $request->validate([
            'estado_validacion' => ['required', Rule::in(['pendiente', 'aprobado', 'rechazado'])],
        ]);

        $motoristaPerfil = MotoristaPerfil::where('usuario_id', $user->id)->first();

        if (!$motoristaPerfil) {
            return response()->json(['error' => 'Motorista profile not found'], 404);
        }

        $motoristaPerfil->update([
            'estado_validacion' => $request->estado_validacion,
        ]);

        return response()->json([
            'message' => 'Motorista validation status updated successfully',
            'data' => $motoristaPerfil,
        ]);
    }

    public function getAllTrips()
    {
        $trips = Viaje::all();
        return response()->json($trips);
    }
}
