const btnLogout = document.getElementById('btn-logout');
const messageLogout = document.getElementById('message-logout');

async function logout() {
    const token = localStorage.getItem('auth_token');
    if (!token){
        alert('O Token não foi encontrado!');
        return;
    }
    const url = `http://127.0.0.1:8000/api/logout`;
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
            console.error("Token inválido ou expirado");
            localStorage.removeItem('auth_token');
            return;
        }
        if (!response.ok){
            throw new Error(`Erro ao buscar dados: ${response.status}`)
        }
        const data = await response.json();
        alert(`${data.message}!`);
        localStorage.removeItem('auth_token');
        setTimeout(() => {
            window.location.href = './index.html';
        },300);
    }
    catch (error){
        console.error(`Falha na requisição!`, error.message);
    }
}
btnLogout.addEventListener('click', (event) => {
    event.preventDefault();
    logout();
})