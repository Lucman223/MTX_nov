<?php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

$users = ['moto@mototx.com', 'cliente@mototx.com', 'admin@mototx.com'];
$password = Hash::make('123456');

foreach ($users as $email) {
    $u = User::where('email', $email)->first();
    if ($u) {
        $u->password = $password;
        $u->save();
        echo "Updated $email to 123456\n";
    } else {
        echo "Warning: $email not found\n";
    }
}
