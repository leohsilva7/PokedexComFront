const contentList = document.getElementById('content-list');

async function listPokemon() {
    const token = localStorage.getItem('auth_token');
    const url = "http://127.0.0.1:8000/api/pokemon/list";
    try{
        const response = await fetch (url,{
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
            }
        });
        if (response.status === 401 || response.status === 403){
            console.error('Token inválido ou expirado');
            localStorage.removeItem('auth_token');
            return
        }
        if (!response.ok){
            throw new Error(`Erro ao buscar dados: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error){
        console.error('Falha ao fazer requisição!', error.message);
    }
}
async function initApp() {
    const result = await listPokemon();
    const pokemonList = result && result.data ? result.data : [];
    const listItems = pokemonList.map((pokemon) => {
        const idPokemon = pokemon.id || pokemon.pokedex_id || 'N/A';
        const nomePokemon = pokemon.name_english || pokemon.name || 'Nome Desconhecido';
        
        const imgPokemon = pokemon.image && pokemon.image.sprite 
                           ? pokemon.image.sprite 
                           : 'placeholder.png';
        const typesArray = pokemon.types || [];
    
        const typesString = typesArray.map(t => t.name_english).join(', ')
        return `
            <div class="pokemon-card">
                <img src="${imgPokemon}" alt="${nomePokemon} Sprite" class="pokemon-image">
                <div class="pokemon-details">
                    <p class="pokemon-id">#${idPokemon}</p>
                    <h3 class="pokemon-name">${nomePokemon}</h3>
                    <p class="pokemon-type">Tipo(s): 
                        <span class="type-badge type"> ${typesString}</span>
                    
                    </p>
                </div>
            </div>
        `;
    });
    const htmlContent = listItems.join('');
    contentList.innerHTML = htmlContent;
    contentList.classList.toggle('remove');
}
initApp();
