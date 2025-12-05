const btnEnviar = document.getElementById('btn-go');
// Puxando todos os input
const pokemonId = document.getElementById('pokemon-id');
const pokemonName = document.getElementById('name_english-id');
const pokemonType = document.getElementById('type-id');
const pokemonHp = document.getElementById('hp-id');
const pokemonAttack = document.getElementById('attack-id');
const pokemonDefense = document.getElementById('defense-id');
const pokemonSpAttack = document.getElementById('sp-attack-id');
const pokemonSpDefense = document.getElementById('sp-defense-id');
const pokemonSpeed = document.getElementById('speed-id');
const pokemonSpecie = document.getElementById('specie-id');
const pokemonDescription = document.getElementById('description-id');
const pokemonPrevEvolution = document.getElementById('prev-evolution-id');
const pokemonNextEvolution = document.getElementById('next-evolution-id');
const pokemonHeight = document.getElementById('height-id');
const pokemonWeight = document.getElementById('weight-id');
const pokemonEgg = document.getElementById('egg-id');
const pokemonAbility = document.getElementById('ability-id');
const pokemonAbilityCheck = document.getElementById('check-id');
const pokemonGenre = document.getElementById('genre-id');
const pokemonImg = document.getElementById('img-id');

function getPokemonData(){
    const data = {
        id: pokemonId.value,
                name:{
                    english: pokemonName.value
                },
                type: [pokemonType.value],
                base: {
                    HP: pokemonHp.value,
                    Attack: pokemonAttack.value,
                    Defense: pokemonDefense.value,
                    "Sp. Attack": pokemonSpAttack.value,
                    "Sp. Defense": pokemonSpDefense.value,
                    Speed: pokemonSpeed.value,
                },
                species: pokemonSpecie.value ? pokemonSpecie.value : pokemonSpecie.value = 'Unknown',
                description: pokemonDescription.value ? pokemonDescription.value : pokemonDescription.value = 'N/A',
                evolution: {
                    prev: pokemonPrevEvolution.value !== "" ? [pokemonPrevEvolution.value] : [],
                    next: 
                        pokemonNextEvolution.value !== "" ? [[pokemonNextEvolution.value]] : [],
                },
                profile: {
                    height: pokemonHeight.value,
                    weight: pokemonWeight.value,
                    egg: [pokemonEgg.value],
                    ability: [
                        [pokemonAbility.value, pokemonAbilityCheck.checked],
                    ],
                    gender: pokemonGenre.value
                },
                image: {
                    hires: pokemonImg.value,
                }
    }
    return data;
}
// Função de ler pokémon (consumo API)
async function readPokemon(pokemonData) {
    const token = localStorage.getItem('auth_token');
    const url = `http://127.0.0.1:8000/api/pokemon/read`;
    try{
        const response = await fetch(url, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(pokemonData),
        });
        if (!response.ok){
            const errorData = await response.json();
            throw new Error(`Erro ao ler daddos do Pokémon! ${response.status}, ${errorData.message}`);
        }
        const apiData = await response.json();
        return apiData;
    }
    catch(error){
        console.error('Falha ao Adicionar dados de leitura na api', error.message);
    }
}

btnEnviar.addEventListener('click', (event) => {
    event.preventDefault();
    const dataToSend = getPokemonData();
    readPokemon(dataToSend);
});