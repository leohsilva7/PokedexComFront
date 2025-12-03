const btnGo = document.getElementById('btn-go');
const usernameInput = document.getElementById('username-id');
const passwordInput = document.getElementById('password-id');

const btnTrainerData = document.getElementById('btn-get-trainer-data');
const contentTrainer = document.getElementById('content-data');

const pokemonInput = document.getElementById('pokemonId');
const contentPokemon = document.getElementById('pokemon-data');
const btnViewPokemon = document.getElementById('btn-view-pokemon');
const pokemonImage = document.getElementById('pokemon-img');
async function login(){
    const usernameValue = usernameInput.value;
    const passwordValue = passwordInput.value;

    const url = "http://127.0.0.1:8000/api/signin";
    try{
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                username: usernameValue,
                password: passwordValue,
            })
        });
        if (!response.ok){
            const errorData = await response.json();
            throw new Error(`Erro de login: ${response.status} - ${errorData.message || 'Credenciais inválidas'}`)
        }
        const data = await response.json();
        if (data.token){
            localStorage.setItem('auth_token', data.token);
            console.log('Login Bem-sucedido', data.token);
        }
    }
    catch (error){
        console.error('Falha na operação de login: ', error.message);
    }
}

btnGo.addEventListener('click', (event) =>{
    event.preventDefault();
    login();
})
// Trainer Data
async function getTrainerData() {
    const token = localStorage.getItem('auth_token');
    const url = `http://127.0.0.1:8000/api/trainer/data`;
    
    try{
        const response = await fetch(url, {
            method: "GET",
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
        contentTrainer.textContent = `${JSON.stringify(data, undefined, 2)}`;
        return data;
    }
    catch(error){
        console.error('Falha na requisição protegida.', error.message);
    }
}
btnTrainerData.addEventListener('click', (event) => {
    event.preventDefault();
    getTrainerData();
})
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