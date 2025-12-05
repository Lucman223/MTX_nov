<?php

namespace App\Http\Controllers\Pagos;

use App\Models\User; // Import User for auth()->user()
use Carbon\Carbon;
use App\Http\Requests\Pagos\BuyForfaitRequest;
use App\Services\ForfaitService;

class ClienteForfaitController extends Controller
{
    protected $forfaitService;

    public function __construct(ForfaitService $forfaitService)
    {
        $this->forfaitService = $forfaitService;
    }

    public function buyForfait(BuyForfaitRequest $request)
    {
        $user = auth()->user();

        try {
            $clienteForfait = $this->forfaitService->buyForfait($user, $request->forfait_id);
            return response()->json([
                'message' => 'Forfait purchased successfully',
                'data' => $clienteForfait,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
