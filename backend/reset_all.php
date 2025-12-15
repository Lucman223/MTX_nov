<?php
use App\Models\User;
use Illuminate\Support\Facades\Hash;
$count = 0;
User::all()->each(function($u) use (&$count) {
    $u->password = Hash::make('123456');
    $u->save();
    echo "Reset password for: " . $u->email . "\n";
    $count++;
});
echo "Total users updated: $count\n";
