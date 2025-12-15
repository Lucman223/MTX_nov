<?php
use App\Models\User;
User::all()->each(function($u){
    echo "User: " . $u->email . "\n";
});
