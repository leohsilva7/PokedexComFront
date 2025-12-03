const btnList = document.getElementById('btn-list-pokemon');
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
        contentList.textContent = `${JSON.stringify(data, undefined, 2)}`;
        return data;
    }
    catch (error){
        console.error('Falha ao fazer requisição!', error.message);
    }
}
btnList.addEventListener('click', (event) => {
    event.preventDefault();
    listPokemon();
});