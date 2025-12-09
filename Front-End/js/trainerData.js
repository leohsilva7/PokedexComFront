const contentTrainer = document.getElementById('content-data');

// Trainer Data
async function getTrainerData() {
    const token = localStorage.getItem('auth_token');
    const url = `https://pokedexcomfront.onrender.com/api/trainer/data`;
    
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
        return data;
    }
    catch(error){
        console.error('Falha na requisição protegida.', error.message);
    }
}
async function initApp() {
    const result = await getTrainerData();
    contentTrainer.innerHTML =
    `<li class="col-12 col-md-8 col-lg-6">
        <div class="card trainer-card shadow-sm h-100" style="min-height: 50vh;">
            <div class="card-body text-center d-flex flex-column justify-content-center">
                <h3 class="card-title text-capitalize trainer-name mb-3">Nome: ${result.name}</h3>
                <p class="card-text text-muted mb-2 fs-5">Sobrenome: ${result.lastname}</p>
                <p class="card-text text-muted mb-2">Data de Nascimento: ${result.birthdate}</p>
                <p class="card-text text-muted mb-2">Cidade de Nascimento: ${result.city}</p>
                <p class="card-text text-muted mb-2">Nome de Usuário: <strong>${result.username}</strong></p>
            </div>
        </div>
    </li>`;
}
initApp();
    