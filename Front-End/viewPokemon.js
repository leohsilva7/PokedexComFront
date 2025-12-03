const pokemonInput = document.getElementById('pokemonId');
const contentPokemon = document.getElementById('pokemon-data');
const btnViewPokemon = document.getElementById('btn-view-pokemon');
const pokemonImage = document.getElementById('pokemon-img');

async function viewPokemon(value) {
    const token = localStorage.getItem('auth_token');
    const url = `http://127.0.0.1:8000/api/pokemon/view?id=${value}`;

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
        console.error(`Erro ao buscar dados: `, error.message);
    }
}
btnViewPokemon.addEventListener('click', async (event) => {
    event.preventDefault();
    const result = await viewPokemon(pokemonInput.value);
    contentPokemon.textContent = `${JSON.stringify(result)}`;
    const imageData = result.image;
    pokemonImage.src = imageData.sprite;
});