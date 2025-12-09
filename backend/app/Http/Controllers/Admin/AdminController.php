<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Models\MotoristaPerfil; // Import MotoristaPerfil
use App\Models\Viaje; // Import Viaje
use App\Models\Transaccion; // Import Transaccion
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Requests\Admin\UpdateMotoristaStatusRequest;
use App\Services\UserService;
use App\Services\MotoristaService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Controllers\Controller;

class AdminController extends Controller
{
    protected $userService;
    protected $motoristaService;

    public function __construct(UserService $userService, MotoristaService $motoristaService)
    {
        $this->userService = $userService;
        $this->motoristaService = $motoristaService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::with('motorista_perfil');

        if ($request->has('rol')) {
            $query->where('rol', $request->rol);
        }

        return $query->get();
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
    public function update(UpdateUserRequest $request, User $user)
    {
        $updatedUser = $this->userService->updateProfile($user, $request->validated());

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $updatedUser,
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

    public function updateMotoristaStatus(UpdateMotoristaStatusRequest $request, User $user)
    {
        if ($user->rol !== 'motorista') {
            return response()->json(['error' => 'User is not a motorista'], 400);
        }

        try {
            $motoristaPerfil = $this->motoristaService->updateValidationStatus($user, $request->estado_validacion);
            return response()->json([
                'message' => 'Motorista validation status updated successfully',
                'data' => $motoristaPerfil,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Motorista profile not found'], 404);
        }
    }

    public function getAllTrips()
    {
        $trips = Viaje::all();
        return response()->json($trips);
    }

    public function getAllTransacciones()
    {
        $transacciones = Transaccion::all();
        return response()->json($transacciones);
    }
}
