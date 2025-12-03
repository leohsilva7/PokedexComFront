<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Trainer extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'lastname',
        'birthdate',
        'city',
        'username',
        'password',
    ];
    protected $hidden =[
        'created_at',
        'updated_at',
        'password',
        'id',
    ];
    protected $casts = [
        'password' => 'hashed',
    ];
}
