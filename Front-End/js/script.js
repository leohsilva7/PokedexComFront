const checkToken = localStorage.getItem('auth_token');
if (!checkToken){
    alert('Token não informado!');
    window.location.href = './index.html';
}