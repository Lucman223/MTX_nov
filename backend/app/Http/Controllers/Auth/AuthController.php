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

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // [ES] Buscamos al usuario por email para realizar la verificación manual del hash
        // [FR] Nous recherchons l'utilisateur par e-mail pour effectuer la vérification manuelle du hash
        $user = User::where('email', $credentials['email'])->first();

        if (!$user) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        // [ES] Verificamos la contraseña usando la función nativa de PHP
        // [FR] Nous vérifions le mot de passe en utilisant la fonction native de PHP
        if (!password_verify($credentials['password'], $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        // [ES] Verificamos si el hash actual cumple con el estándar Argon2id configurado
        // [FR] Nous vérifions si le hash actuel respecte la norme Argon2id configurée
        if (password_needs_rehash($user->password, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,
            'time_cost' => 4,
            'threads' => 1
        ])) {
            // [ES] Actualizamos el hash de forma invisible para el usuario
            // [FR] Nous mettons à jour le hash de manière invisible pour l'utilisateur
            $user->password = password_hash($credentials['password'], PASSWORD_ARGON2ID, [
                'memory_cost' => 65536,
                'time_cost' => 4,
                'threads' => 1
            ]);
            $user->save();
            \Illuminate\Support\Facades\Log::info("Password rehashed to Argon2id for user ID: {$user->id}");
        }

        try {
            // [ES] Generamos el token JWT para el usuario validado
            if (! $token = JWTAuth::fromUser($user)) {
                return response()->json(['error' => 'Could not create token'], 500);
            }
        } catch (JWTException $e) {
            \Illuminate\Support\Facades\Log::error('JWT Error: ' . $e->getMessage());
            return response()->json(['error' => 'Could not create token', 'message' => $e->getMessage()], 500);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'user' => $user->load(['clienteForfaits.forfait', 'motorista_perfil']),
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
    /**
     * [ES] Elimina la cuenta del usuario actual (RGPD).
     * [FR] Supprime le compte de l'utilisateur actuel (RGPD).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = auth()->user();
        
        // Explicitly invalidate current token before logout
        try {
            $token = JWTAuth::getToken();
            if ($token) {
                JWTAuth::invalidate($token);
            }
        } catch (\Exception $e) {
            // Silently fail if token is already invalid
        }

        $this->userService->deleteUser($user);

        auth()->logout();

        return response()->json([
            'message' => 'Account deleted successfully',
        ]);
    }
}
