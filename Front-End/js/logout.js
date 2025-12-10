const btnLogout = document.getElementById('btn-logout');
const messageLogout = document.getElementById('message-logout');

async function logout() {
    const token = localStorage.getItem('auth_token');
    const url = `https://pokedexcomfront.onrender.com/api/logout`;
    try{
        const response = await fetch (url, {
            method: "GET",
            "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status == 403){
            alert("Token inválido ou expirado");
            localStorage.removeItem('auth_token');
            return;
        }
        if (!response.ok){
            alert(`Erro ao buscar dados: ${response.status}`)
        }
        const data = await response.json();
        alert(`${data.message}!`);
        localStorage.removeItem('auth_token');
        setTimeout(() => {
            window.location.href = './index.html';
        },300);
    }
    catch (error){
        alert(`Falha na requisição!`, error.message);
    }
}
btnLogout.addEventListener('click', (event) => {
    event.preventDefault();
    logout();
})