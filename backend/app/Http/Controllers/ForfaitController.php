<?php

namespace App\Http\Controllers;

use App\Models\Forfait;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ForfaitController extends Controller
{
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
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'viajes_incluidos' => 'required|integer|min:1',
            'dias_validez' => 'required|integer|min:1',
            'estado' => ['required', Rule::in(['activo', 'inactivo'])],
        ]);

        $forfait = Forfait::create($request->all());

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
    public function update(Request $request, Forfait $forfait)
    {
        $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'sometimes|numeric|min:0',
            'viajes_incluidos' => 'sometimes|integer|min:1',
            'dias_validez' => 'sometimes|integer|min:1',
            'estado' => ['sometimes', Rule::in(['activo', 'inactivo'])],
        ]);

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
}
