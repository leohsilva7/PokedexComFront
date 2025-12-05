<?php

namespace App\Http\Controllers;

use App\Models\Pokemon;
use App\Models\Type;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PokemonController extends Controller
{
    public function list()
    {
        $pokemon = Pokemon::select('id', 'name_english', 'image')
        ->orderBy('id')
        ->paginate(10);

        return response()->json($pokemon, 200);
    }

    public function view(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors());
        }

        $pokemon = Pokemon::find($request->id);

        return response()->json($pokemon, 200);
    }

    public function read(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
        ]);

        if ($validator->fails()){
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors(),
            ], 422);
        }

        $pokemonData = $request->except(['id', 'type', 'name']);

        $pokemonData['pokedex_id'] = $request->input('id');
        $pokemonData['name_english'] = $request->input('name.english');

        $pokemon = Pokemon::updateOrCreate(
            ['pokedex_id' => $pokemonData['pokedex_id']],
            $pokemonData
        );

        if ($request->has('type')) {
            $typeNames = $request->input('type');

            $typeIds = Type::whereIn('name_english', $typeNames)->pluck('id');

            $pokemon->types()->sync($typeIds);
        }

        return response()->json([
            'message' => 'Dados do Pokemon Atualizados Com Sucesso!'
        ], 200);
    }
}
