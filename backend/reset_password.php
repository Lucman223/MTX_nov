<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Hash;
use App\Models\User;

$user = User::where('email', 'admin@mototx.com')->first();
if ($user) {
    $user->password = Hash::make('password');
    $user->save();
    echo "RESET_SUCCESS";
} else {
    echo "USER_NOT_FOUND";
}
