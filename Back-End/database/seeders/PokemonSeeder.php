<?php

namespace Database\Seeders;

use App\Models\Pokemon;
use App\Models\Type;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class PokemonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $typesJson = File::get(database_path('seeders/data/types.json'));
        $pokedexJson = File::get(database_path('seeders/data/pokedex.json'));

        $typesData = json_decode($typesJson, true);
        $pokedexData = json_decode($pokedexJson, true);

        $typesMap = [];
        $this->command->info('Rodando Seeder');

        foreach ($typesData as $type) {
            $newType = Type::create([
                'name_english' => $type['english'],
                'effective' => $type['effective'],
                'ineffective' => $type['ineffective'],
                'no_effect' => $type['no_effect'] ?? [],
            ]);
            $typesMap[$type['english']] = $newType->id;
        }
        $this->command->info('Tipos Adicionados!');

        foreach ($pokedexData as $pokemon){
            $newPokemon = Pokemon::create([
                'pokedex_id' => $pokemon['id'],
                'name_english' => $pokemon['name']['english'],
                'base' => $pokemon['base'] ?? [],
                'species' => $pokemon['species'] ?? 'Unknown',
                'description' => $pokemon['description'] ?? 'N/A',
                'evolution' => $pokemon['evolution'] ?? [],
                'profile' => $pokemon['profile'] ?? [],
                'image' => $pokemon['image'] ?? [],
            ]);

            $typesIdsToAttach = [];
            foreach ($pokemon['type'] as $typeName){
                if (isset($typesMap[$typeName])){
                    $typesIdsToAttach[] = $typesMap[$typeName];
                }
            }
            if (!empty($typesIdsToAttach)){
                $newPokemon->types()->attach($typesIdsToAttach);
            }
        }
        $this->command->info("Pokémon Adicionados com sucesso!");
    }
}
