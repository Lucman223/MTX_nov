use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\Pagos\InitiatePaymentRequest;
use App\Services\OrangeMoneyService;

class OrangeMoneyController extends Controller
{
    protected $orangeMoneyService;

    public function __construct(OrangeMoneyService $orangeMoneyService)
    {
        $this->orangeMoneyService = $orangeMoneyService;
    }

    public function initiatePayment(InitiatePaymentRequest $request)
    {
        $user = auth()->user();

        try {
            $result = $this->orangeMoneyService->initiatePayment($user, $request->forfait_id, $request->phone_number);
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function handleCallback(Request $request)
    {
        try {
            $result = $this->orangeMoneyService->handleCallback($request->all());
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
