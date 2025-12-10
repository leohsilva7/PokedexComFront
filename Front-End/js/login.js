const btnGo = document.getElementById('btn-go');
// const usernameInput = document.getElementById('username-id');
const usernameInput = document.getElementById('username-id');
const passwordInput = document.getElementById('password-id');
async function login(){
    const usernameValue = usernameInput.value;
    const passwordValue = passwordInput.value;

    const url = "https://pokedexcomfront.onrender.com/api/signin";
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
            alert(`Erro de login: ${response.status} - ${errorData.message || 'Credenciais inválidas'}`);
            return;
        }
        const data = await response.json();
        if (data.token){
            localStorage.setItem('auth_token', data.token);
            alert('Login Bem-sucedido');
            window.location.href = "./dashboard.html";
        }
    }   
    catch (error){
        alert('Falha na operação de login: ', error.message);
    }
}

btnGo.addEventListener('click', (event) =>{
    event.preventDefault();
    login();
})