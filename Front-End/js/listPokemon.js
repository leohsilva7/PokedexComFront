const contentList = document.getElementById('content-list');
const btnNext = document.getElementById('next-page');
const btnPast = document.getElementById('past-page');
let count = 1;
async function listPokemon(page) {
    const token = localStorage.getItem('auth_token');
    const url = `https://pokedexcomfront.onrender.com/api/pokemon/list?page=${page}`;
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
            alert('Token inválido ou expirado');
            localStorage.removeItem('auth_token');
            window.location.href = "./index.html";
            return
        }
        if (!response.ok){
            alert(`Erro ao buscar dados: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error){
        alert('Falha ao fazer requisição!', error.message);
    }
}
async function initApp(numPage) {
    const result = await listPokemon(numPage);
    const pokemonList = result && result.data ? result.data : [];
    const listItems = pokemonList.map((pokemon) => {
        const idPokemon = pokemon.id || pokemon.pokedex_id || 'N/A';
        const nomePokemon = pokemon.name_english || pokemon.name || 'Nome Desconhecido';
        
        const imgPokemon = pokemon.image && pokemon.image.hires
                           ? pokemon.image.hires
                           : 'placeholder.png';
        const typesArray = pokemon.types || [];
    
        const typesBadges = typesArray.map(t => `<span class="badge rounded-pill type-badge bg-${t.name_english.toLowerCase()}">${t.name_english}</span>`).join(' ');

        return `
            <li class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card pokemon-card shadow-sm h-100"> 
                    <img src="${imgPokemon}" alt="${nomePokemon} Sprite" class="card-img-top pokemon-image mx-auto d-block" style="width: 120px; height:120px; object-fit:contain;">
                    <div class="card-body text-center">
                        <p class="card-text text-muted mb-1">${idPokemon}</p>
                        <h5 class="card-title text-capitalize pokemon-name">${nomePokemon}</h5>
                        <div class="pokemon-type mt-2">${typesBadges}</div>
                    </div>
                </div>
            </li>
        `;
    });
    const htmlContent = listItems.join('');
    contentList.innerHTML = htmlContent;
}
initApp(count);
btnNext.addEventListener('click', (event) =>{
    event.preventDefault();
    if (count >= 75){
        count = 1;
    }
    else{
        count ++;
    }
    initApp(count);
});
btnPast.addEventListener('click', (event) =>{
    event.preventDefault();
    if (count <= 1){
        count = 1;
    }
    else{
        count --;
    }
    initApp(count);
});
