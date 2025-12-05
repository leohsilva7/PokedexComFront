const contentTrainer = document.getElementById('content-data');

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
        return data;
    }
    catch(error){
        console.error('Falha na requisição protegida.', error.message);
    }
}
async function initApp() {
    const result = await getTrainerData();
    contentTrainer.innerHTML = `<li>Nome: ${result.name}</li>`;
    contentTrainer.innerHTML += `<li>Sobrenome: ${result.lastname}</li>`;
    contentTrainer.innerHTML += `<li>Data de Nascimento: ${result.birthdate}</li>`
    contentTrainer.innerHTML += `<li>Cidade de Nascimento: ${result.city}</li>`
    contentTrainer.innerHTML += `<li>Nome de Usuário: ${result.username}</li>`
    contentTrainer.classList.toggle('remove');
}
initApp();
    