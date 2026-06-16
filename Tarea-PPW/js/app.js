document.addEventListener("DOMContentLoaded", () => {
    const inputBusqueda = document.getElementById("pokemon-input");
    const botonBuscar = document.getElementById("search-btn");
    
    const cardLoading = document.getElementById("card-loading");
    const cardContent = document.getElementById("card-content");
    
    const pokeId = document.getElementById("poke-id");
    const pokeImg = document.getElementById("poke-img");
    const pokeName = document.getElementById("poke-name");
    const pokeTypes = document.getElementById("poke-types");
    
    const statHp = document.getElementById("stat-hp");
    const statAtk = document.getElementById("stat-atk");
    const statDef = document.getElementById("stat-def");
    const statSpd = document.getElementById("stat-spd");

    function obtenerDatosPokemon(pokemon) {
        cardLoading.classList.remove("hidden");
        cardContent.classList.add("hidden");
        cardLoading.innerText = "Buscando en la base de datos...";

        const xhr = new XMLHttpRequest();
        const url = `https://pokeapi.co{pokemon.toLowerCase().trim()}`;

        xhr.open("GET", url, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        renderizarPokemon(data);
                    } catch (e) {
                        console.error("Error al procesar JSON:", e);
                        mostrarError("Error al procesar los datos del servidor.");
                    }
                } else {
                    console.error("Error de estado HTTP:", xhr.status);
                    mostrarError("Pokémon no encontrado o error de red.");
                }
            }
        };

        xhr.send();
    }

    function renderizarPokemon(pokemon) {
        cardLoading.classList.add("hidden");
        cardContent.classList.remove("hidden");

        // Datos Básicos
        pokeId.innerText = `#${pokemon.id.toString().padStart(3, '0')}`;
        pokeName.innerText = pokemon.name;
        
        // Imagen
        pokeImg.src = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;

        // Tipos
        pokeTypes.innerHTML = "";
        pokemon.types.forEach(item => {
            const pill = document.createElement("span");
            pill.classList.add("type-pill", `type-${item.type.name}`);
            if(!pill.className.match(/type-(fire|water|grass|electric|normal|poison)/)) {
                pill.classList.add("type-normal");
            }
            pill.innerText = item.type.name;
            pokeTypes.appendChild(pill);
        });

        // Estadísticas Base
        const maxStat = 150;
        
        let hp = pokemon.stats.find(s => s.stat.name === "hp").base_stat;
        let atk = pokemon.stats.find(s => s.stat.name === "attack").base_stat;
        let def = pokemon.stats.find(s => s.stat.name === "defense").base_stat;
        let spd = pokemon.stats.find(s => s.stat.name === "speed").base_stat;

        statHp.style.width = `${Math.min((hp / maxStat) * 100, 100)}%`;
        statAtk.style.width = `${Math.min((atk / maxStat) * 100, 100)}%`;
        statDef.style.width = `${Math.min((def / maxStat) * 100, 100)}%`;
        statSpd.style.width = `${Math.min((spd / maxStat) * 100, 100)}%`;
    }

    function mostrarError(mensaje) {
        cardContent.classList.add("hidden");
        cardLoading.classList.remove("hidden");
        cardLoading.innerHTML = `<span style="color: #ef5350; font-weight: bold;">❌ Error.</span><br><small>${mensaje}</small>`;
    }

    botonBuscar.addEventListener("click", () => {
        if (inputBusqueda.value !== "") obtenerDatosPokemon(inputBusqueda.value);
    });

    inputBusqueda.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && inputBusqueda.value !== "") obtenerDatosPokemon(inputBusqueda.value);
    });

    // Carga inicial por defecto
    obtenerDatosPokemon("pikachu");
});
