<?php

namespace App\Http\Controllers;

use App\Models\Trainer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|required|max:255',
            'lastname' => 'string|string|max:255',
            'birthdate' => 'required|date',
            'city' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:trainers,username',
            'password' => 'required|string|max:255|min:4',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Não foi possível realizar seu cadastro na Pokédex devido a informações conflitantes de tipos de dados'
            ], 422);
        }
        $newTrainer = Trainer::create([
            'name' => $request->name,
            'lastname' => $request->lastname,
            'birthdate' => $request->birthdate,
            'city' => $request->city,
            'username' => $request->username,
            'password' => $request->password,
        ]);

        return response()->json([
            'message' => 'Treinador, você foi registrado com sucesso na sua Pokédex'
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->only('username', 'password'),[
            'username' => 'required|string|max:255',
            'password' => 'required|string|max:255|min:4'
        ]);

        if($validator->fails()){
            return response()->json([
                'message' => 'Treinador, faltam dados para podermos autenticar você na sua Pokédex'
            ],422);
        }
        $trainer = Trainer::where('username', $request->username)->first();

        if (!$trainer || !Hash::check($request->password, $trainer->password)){
            return response()->json([
                'message' => 'Treinador, parece que seus dados estão incorretos, confira e tente novamente'
            ],401);
        }
        $token = $trainer->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Treinador, você foi autenticado com sucesso!',
            'token' => $token,
            'token_type' => 'Bearer'
        ],200);
    }
    public function logout()
    {
        $logout = Auth::user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Você saiu da sua Pokédex com sucesso'
        ],200);
    }
    public function trainerData()
    {
        $trainer = Auth::user();
        return response()->json($trainer,200);
    }
}
