const contentList = document.getElementById('content-list');
const btnNext = document.getElementById('next-page');
const btnPast = document.getElementById('past-page');
let count = 1;

async function listPokemon(page) {
    const token = localStorage.getItem('auth_token');
    const url = `https://pokedexcomfront.onrender.com/api/pokemon/list?page=${page}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });

        if (response.status === 401 || response.status === 403) {
            alert('Token inválido ou expirado');
            localStorage.removeItem('auth_token');
            window.location.href = "./index.html";
            return;
        }

        if (!response.ok) {
            console.error(`Erro ao buscar dados: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Falha ao fazer requisição!', error.message);
    }
}

async function initApp(numPage) {
    contentList.innerHTML = '<div class="text-center w-100 mt-5"><div class="spinner-border text-danger" role="status"></div></div>';

    const result = await listPokemon(numPage);
    const pokemonList = result && result.data ? result.data : [];

    const listItems = pokemonList.map((pokemon) => {
        const idPokemon = pokemon.id || pokemon.pokedex_id || 'N/A';
        const nomePokemon = pokemon.name_english || pokemon.name || 'Nome Desconhecido';

        const imgPokemon = pokemon.image && pokemon.image.hires
            ? pokemon.image.hires
            : 'placeholder.png';

        const typesArray = pokemon.types || [];
        const typesBadges = typesArray.map(t =>
            `<span class="badge rounded-pill type-badge bg-${t.name_english.toLowerCase()}">${t.name_english}</span>`
        ).join(' ');

        return `
            <li class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card pokemon-card shadow-sm h-100"> 
                    <img 
                        src="${imgPokemon}" 
                        alt="${nomePokemon} Sprite" 
                        class="card-img-top pokemon-image mx-auto d-block mt-3" 
                        style="width: 120px; height:120px; object-fit:contain; cursor: pointer; transition: transform 0.2s;"
                        onmouseover="this.style.transform='scale(1.1)'"
                        onmouseout="this.style.transform='scale(1)'"
                        onclick="openPokemonModal(${idPokemon})"
                    >
                    <div class="card-body text-center">
                        <p class="card-text text-muted mb-1">#${idPokemon}</p>
                        <h5 class="card-title text-capitalize pokemon-name">${nomePokemon}</h5>
                        <div class="pokemon-type mt-2">${typesBadges}</div>
                    </div>
                </div>
            </li>
        `;
    });

    contentList.innerHTML = listItems.join('');
}

async function openPokemonModal(id) {
    const token = localStorage.getItem('auth_token');

    const modalTitle = document.getElementById('modalTitle');
    const modalImg = document.getElementById('modalImg');
    const modalId = document.getElementById('modalId');
    const modalName = document.getElementById('modalName');
    const modalTypes = document.getElementById('modalTypes');
    const modalDescription = document.getElementById('modalDescription');
    const modalStats = document.getElementById('modalStats');

    modalName.innerText = "Carregando...";
    modalDescription.innerText = "";
    modalImg.src = "";
    modalStats.innerHTML = "";

    const myModal = new bootstrap.Modal(document.getElementById('pokemonModal'));
    myModal.show();

    const url = `https://pokedexcomfront.onrender.com/api/pokemon/view?id=${id}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Erro ao buscar detalhes');

        const data = await response.json();

        modalTitle.innerText = `Detalhes: ${data.name_english}`;
        modalImg.src = data.image.hires;
        modalId.innerText = `#${data.id}`;
        modalName.innerText = data.name_english;
        modalDescription.innerText = data.description || "Sem descrição disponível.";

        const typesBadges = data.types.map(t =>
            `<span class="badge rounded-pill bg-${t.name_english.toLowerCase()} mx-1" style="font-size: 0.9rem;">${t.name_english}</span>`
        ).join('');
        modalTypes.innerHTML = typesBadges;

        const baseStats = data.base;

        let statsHtml = '<div class="row text-start">';
        for (const [key, value] of Object.entries(baseStats)) {
            let width = (value / 150) * 100;
            if (width > 100) width = 100;

            statsHtml += `
                <div class="col-12 mb-2">
                    <div class="d-flex justify-content-between small fw-bold">
                        <span class="text-uppercase text-secondary">${key}</span>
                        <span>${value}</span>
                    </div>
                    <div class="progress" style="height: 8px;">
                        <div class="progress-bar bg-danger" role="progressbar" 
                             style="width: ${width}%" 
                             aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="150">
                        </div>
                    </div>
                </div>
            `;
        }
        statsHtml += '</div>';

        modalStats.innerHTML = statsHtml;

    } catch (error) {
        console.error(error);
        modalName.innerText = "Erro ao carregar";
        modalDescription.innerText = "Verifique sua conexão ou tente novamente.";
        alert("Não foi possível carregar os detalhes deste Pokémon.");
    }
}

initApp(count);

btnNext.addEventListener('click', (event) => {
    event.preventDefault();
    if (count >= 75) {
        count = 1;
    } else {
        count++;
    }
    initApp(count);
});

btnPast.addEventListener('click', (event) => {
    event.preventDefault();
    if (count <= 1) {
        count = 1;
    } else {
        count--;
    }
    initApp(count);
});
