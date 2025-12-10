const nameInput = document.getElementById('name-id');
const lastnameInput = document.getElementById('lastname-id');
const dateInput = document.getElementById('birthdate-id');
const cityInput = document.getElementById('city-id');
const usernameInput = document.getElementById('newusername-id');
const passwordInput = document.getElementById('newpassword-id');
const registerBtn = document.getElementById('register-btn');

async function register() {
    const url = "https://pokedexcomfront.onrender.com/api/signup";
    try{
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                name: nameInput.value,
                lastname: lastnameInput.value,
                birthdate: dateInput.value,
                city: cityInput.value,
                username: usernameInput.value,
                password: passwordInput.value,
            })
        });
        if (!response.ok || response.status === 422){
            const errorData = await response.json();
            alert(`Erro ao registrar: ${response.status} - ${errorData.message}`);
            return;
        }
        alert('Registro bem sucedido!');
        setTimeout(() => {
            window.location.href = './index.html';
        })
    }
    catch (error){
        alert('Falha na operção de registro', error.message);
    }
}
registerBtn.addEventListener('click', (event) => {
    event.preventDefault();
    register();
});