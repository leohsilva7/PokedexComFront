<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Notifications\Notifiable;

class Pokemon extends Model
{
    use HasFactory, Notifiable;
    protected $fillable = [
        'pokedex_id',
        'name_english',
        'type',
        'base',
        'species',
        'description',
        'evolution',
        'profile',
        'image',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    protected $casts = [
        'type' => 'array',
        'base' => 'array',
        'evolution' => 'array',
        'profile' => 'array',
        'image' => 'array'
    ];
    public function types():BelongsToMany
    {
        return $this->belongsToMany(Type::class, 'pokemon_types');
    }
}
