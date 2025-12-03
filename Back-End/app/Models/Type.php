<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Notifications\Notifiable;

class Type extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name_english',
        'effective',
        'ineffective',
        'no_effect',
    ];
    protected $hidden = [
        'created_at',
        'updated_at'
    ];
    protected $casts = [
        'effective' => 'array',
        'ineffective' => 'array',
        'no_effect' => 'array'
    ];
    public function pokemon():BelongsToMany
    {
        return $this->belongsToMany(Pokemon::class, 'pokemon_types');
    }
}
