<?php

namespace App\Http\Controllers\Pagos;

use App\Models\Forfait;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Services\ForfaitService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Pagos\UpdateForfaitRequest;

/**
 * Class ForfaitController
 *
 * [ES] Gestiona las operaciones CRUD para los Forfaits (Planes de Clientes).
 * [FR] Gère les opérations CRUD pour les Forfaits (Plans Clients).
 */
class ForfaitController extends Controller
{
    protected $forfaitService;

    public function __construct(ForfaitService $forfaitService)
    {
        $this->forfaitService = $forfaitService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Forfait::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreForfaitRequest $request)
    {
        $forfait = $this->forfaitService->createForfait($request->validated());

        return response()->json($forfait, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Forfait $forfait)
    {
        return $forfait;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateForfaitRequest $request, Forfait $forfait)
    {

        $forfait->update($request->all());

        return response()->json($forfait);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Forfait $forfait)
    {
        $forfait->delete();

        return response()->json(null, 204);
    }

    /**
     * Display a listing of active forfaits for clients.
     */
    public function getAvailableForfaits()
    {
        return Forfait::where('estado', 'activo')->get();
    }
}
