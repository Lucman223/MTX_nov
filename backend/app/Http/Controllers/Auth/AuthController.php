<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Models\User; // Import User model
use Illuminate\Support\Facades\Hash; // Import Hash facade
use Illuminate\Validation\Rule; // Import Rule for enum validation
use Tymon\JWTAuth\Facades\JWTAuth; // Import JWTAuth facade
use Tymon\JWTAuth\Exceptions\JWTException; // Import JWTException
use App\Http\Requests\Auth\RegisterRequest; // Import RegisterRequest
use App\Http\Requests\Auth\UpdateProfileRequest; // Import UpdateProfileRequest
use App\Services\UserService;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }
    public function register(RegisterRequest $request)
    {
        $user = $this->userService->createUser($request->validated());

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }
        } catch (JWTException $e) {
            \Illuminate\Support\Facades\Log::error('JWT Error: ' . $e->getMessage());
            return response()->json(['error' => 'Could not create token', 'message' => $e->getMessage()], 500);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'user' => auth()->user()->load(['clienteForfaits.forfait', 'motorista_perfil']), // Get the authenticated user with relations
        ]);
    }

    public function getProfile()
    {
        $user = auth()->user();
        if ($user) {
            $user->load(['clienteForfaits.forfait', 'motorista_perfil']);
        }
        return response()->json(['user' => $user]);
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = auth()->user();
        $updatedUser = $this->userService->updateProfile($user, $request->validated());

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $updatedUser,
        ]);
    }
}
