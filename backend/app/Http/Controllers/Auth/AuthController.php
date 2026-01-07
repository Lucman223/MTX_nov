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

/**
 * Class AuthController
 *
 * [ES] Controlador encargado del flujo de autenticación para la API mediante JWT.
 *      Maneja la verificación, registro, inicio de sesión y gestión de perfil para todos los roles.
 *
 * [FR] Contrôleur chargé du flux d'authentification pour l'API via JWT.
 *      Gère la vérification, l'inscription, la connexion et la gestion de profil pour tous les rôles.
 *
 * @package App\Http\Controllers\Auth
 */
class AuthController extends Controller
{
    /**
     * @var UserService Service that handles the business logic for user management.
     */
    protected $userService;

    /**
     * AuthController constructor.
     *
     * @param UserService $userService Dependency injection of UserService.
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * [ES] Registra un nuevo usuario en el sistema.
     * [FR] Inscrit un nouvel utilisateur dans le système.
     *
     * @param RegisterRequest $request Validated request containing user data (name, email, password, role).
     * @return \Illuminate\Http\JsonResponse JSON response with the created user and 201 status code.
     */
    public function register(RegisterRequest $request)
    {
        $user = $this->userService->createUser($request->validated());

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
        ], 201);
    }

    /**
     * [ES] Autentica a un usuario y emite un token JWT.
     * [FR] Authentifie un utilisateur et émet un jeton JWT.
     *
     * @param Request $request Request containing 'email' and 'password'.
     * @return \Illuminate\Http\JsonResponse JSON response with access token, type, expiration, and user data.
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            // Attempt to verify credentials and create a token
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }
        } catch (JWTException $e) {
            \Illuminate\Support\Facades\Log::error('JWT Error: ' . $e->getMessage());
            return response()->json(['error' => 'Could not create token', 'message' => $e->getMessage()], 500);
        }

        // Return the token and user data structure
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'user' => auth()->user()->load(['clienteForfaits.forfait', 'motorista_perfil']), // Eager load relationships
        ]);
    }

    /**
     * Retrieves the authenticated user's profile.
     *
     * @return \Illuminate\Http\JsonResponse JSON response with the authenticated user's data and relations.
     */
    public function getProfile()
    {
        $user = auth()->user();
        if ($user) {
            $user->load(['clienteForfaits.forfait', 'motorista_perfil']);
        }
        return response()->json(['user' => $user]);
    }

    /**
     * Updates the authenticated user's profile information.
     *
     * @param UpdateProfileRequest $request Validated request with update data.
     * @return \Illuminate\Http\JsonResponse JSON response with success message and updated user data.
     */
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
