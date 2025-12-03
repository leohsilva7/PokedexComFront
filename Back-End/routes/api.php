<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/signup', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('/signin', [\App\Http\Controllers\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (){
//    Treinador
    Route::get('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    Route::get('/trainer/data', [\App\Http\Controllers\AuthController::class, 'trainerData']);

//    Pokemon
    Route::post('/pokemon/read', [\App\Http\Controllers\PokemonController::class, 'read']);
    Route::get('/pokemon/list', [\App\Http\Controllers\PokemonController::class, 'list']);
    Route::post('/pokemon/view', [\App\Http\Controllers\PokemonController::class, 'view']);
});
