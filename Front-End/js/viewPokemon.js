const pokemonInput = document.getElementById('pokemonId');
const contentPokemon = document.getElementById('pokemon-data');
const btnViewPokemon = document.getElementById('btn-view-pokemon');
async function viewPokemon(value) {
    const token = localStorage.getItem('auth_token');
    const url = `https://pokedexcomfront.onrender.com/api/pokemon/view?id=${value}`;

    try{
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
         if (response.status === 401 || response.status === 403){
            alert('Token inválido ou expirado');
            localStorage.removeItem('auth_token');
            return
        }
        if (!response.ok){
            alert(`Erro ao buscar dados: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error){
        alert(`Erro ao buscar dados: `, error.message);
    }
}
btnViewPokemon.addEventListener('click', async (event) => {
    event.preventDefault();
    const result = await viewPokemon(pokemonInput.value);
    const imageData = result.image;
    const typesArray = result.types;
    const typesBadges = typesArray.map(t => `<span class="badge rounded-pill type-badge bg-${t.name_english.toLowerCase()}">${t.name_english}</span>`).join(' ');
    contentPokemon.innerHTML = 
    `<li class="col-12 col-sm-6 col-md-4 col-lg-4 mx-auto" style="list-style:none;"> 
        <div class="card pokemon pokemon-card shadow-sm h-100 p-3 d-flex flex-column justify-content-center" style="min-height: 70vh;"> 
            <img src="${imageData.hires}" alt="${result.name_english} Sprite" class="card-img-top pokemon-image mx-auto d-block" style="width:240px;height:240px; object-fit:contain"
            <div class="card-body text-center">
                <p class="card-text text-muted mb-1">${result.id}</p>
                <h5 class="card-title text-capitalize pokemon-name">${result.name_english}</h5>
                <div class="pokemon-type mt-1 mb-1">${typesBadges}</div>
                <p class="card-text text-muted mb-1">${result.description}</p>
            </div>
        </div>
    </li>`;
});

