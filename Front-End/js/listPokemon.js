const contentList = document.getElementById('content-list');
const btnNext = document.getElementById('next-page');
const btnPast = document.getElementById('past-page');

const modalElement = document.getElementById('pokemonModal');
const bsModal = new bootstrap.Modal(modalElement);
const modalTitle = document.getElementById('modalTitle');
const modalImg = document.getElementById('modalImg');
const modalId = document.getElementById('modalId');
const modalName = document.getElementById('modalName');
const modalTypes = document.getElementById('modalTypes');
const modalDescription = document.getElementById('modalDescription');
const modalStats = document.getElementById('modalStats');

let count = 1;
const pageCache = {};
let currentController = null;
async function listPokemon(page) {
    if (pageCache[page]){
        return pageCache[page];
    }

    if (currentController) currentController.abort();
    currentController = new AbortController();

    const token = localStorage.getItem('auth_token');
    const url = `https://pokedexcomfront.onrender.com/api/pokemon/list?page=${page}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            signal: currentController.signal
        });

        if (response.status === 401 || response.status === 403) {
            alert('Token inválido ou expirado');
            localStorage.removeItem('auth_token');
            window.location.href = "./index.html";
            return;
        }

        if (!response.ok) throw new Error(`Erro: ${response.status}`);

        const data = await response.json();
        pageCache[page] = data;
        return data;
    }
    catch (error) {
        if (error.name !== 'AbortError'){
            console.error('Falha na Requisição', error.message);
        }
        return null;
    }
}
async function getPokemonDetails (id){
    const token = localStorage.getItem('auth_token');
    const url = `https://pokedexcomfront.onrender.com/api/pokemon/view?id=${id}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Erro ao buscar detalhes');
        return await response.json();
}
async function renderPage (numPage){
    contentList.innerHTML = `<div class="d-flex justify-content-center mt-5 w-100"><div class="spinner-border text-danger" role="status"></div></div>`;
    const result = await listPokemon(numPage);

    if (!result || !result.data){
        if (result !== undefined) contentList.innerHTML = "";
        return;
    }
    const listItems = result.data.map((pokemon) => {
       const id = pokemon.id || pokemon.pokedex_id;
       const nome = pokemon.name_english || 'Desconhecido';
       const img = pokemon.image?.hires || 'placeholder.png';

       const typesBadges = (pokemon.types || []).map(t =>
           `<span class="badge rounded-pill type-badge bg-${(t.name_english || '').toLowerCase()}">${t.name_english}</span>`
       ).join(' ');
       return `
            <li class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card pokemon-card shadow-sm h-100">
                    <img src="${img}" data-id="${id}" alt="${nome}" loading="lazy" class="card-img-top pokemon-image mx-auto d-block mt-3 clickable-pokemon" style="width: 120px; height: 120px; object-fit: contain">
                    <div class="card-body text-center">
                        <p class="card-text text-muted mb-1">#${id}</p>
                        <h5 class="card-title text-capitalize pokemon-name">${nome}</h5>
                        <div class="pokemon-type mt-2">${typesBadges}</div>
                    </div>
                </div>
            </li>
       `;
    });
    contentList.innerHTML = listItems.join('');
}
async function showPokemonModal (id){
    modalName.innerText = 'Carregando...';
    modalDescription.innerText = '';
    modalImg.src = '';
    modalStats.innerHTML =  '<div class="text-center"> <div class="spinner-border spinner-border-sm"></div></div>';
    bsModal.show();

    try{
        const data = await getPokemonDetails(id);
        modalTitle.innerText = `Detalhes: ${data.name_english}`;
        modalImg.src = data.image.hires;
        modalId.innerText = `#${data.id}`;
        modalName.innerText = data.name_english;
        modalDescription.innerText = data.description || "N/A";
        modalTypes.innerHTML = data.types.map(t =>
            `<span class="badge rounded-pill type-badge bg-${(t.name_english || '').toLowerCase()}">${t.name_english}</span>`
        ).join('');
        let statsHTML = '<div class="row text-start"></div>';
        for (const [key, value] of Object.entries(data.base)){
            const width = Math.min((value / 150) * 100, 100);
            statsHTML += `
                <div class="col-12 mb-2">
                    <div class="d-flex justify-content-between small fw-bold">
                        <span class="text-uppercase text-secondary">${key}</span>
                        <span>${value}</span>
                    </div>
                    <div class="progress" style="height: 8px;">
                        <div class="progress-bar bg-danger" style="width: ${width}%;" role="progressbar"></div>
                    </div>
                </div>
            `;
        }
        modalStats.innerHTML = statsHTML + '</div>';
    }
    catch (error){
        console.error(error);
        modalName.innerText = `Erro!`;
        modalStats.innerHTML = `<p class="text-danger text-center">Falha ao carregar Detalhes.</p>`;
    }
}
contentList.addEventListener('click', (event) =>{
    const target = event.target;
    if (target.classList.contains('clickable-pokemon')){
        const id = target.getAttribute('data-id');
        if (id) showPokemonModal(id);
    }
});
btnNext.addEventListener('click', (event) => {
   event.preventDefault();
   if (count < 75){
       count++;
       renderPage(count);
   }
});
btnPast.addEventListener('click', (event) =>{
   event.preventDefault();
   if (count > 1){
       count--;
       renderPage(count);
   }
});
renderPage(count);