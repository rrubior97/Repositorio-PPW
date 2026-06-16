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
        // Limpiar el texto ingresado quitando espacios
        const nombreLimpio = pokemon.toLowerCase().trim();
        if (!nombreLimpio) return;

        cardLoading.classList.remove("hidden");
        cardContent.classList.add("hidden");
        cardLoading.innerText = "Buscando en la base de datos...";

        const xhr = new XMLHttpRequest();
        // URL ultra-limpia sin barras finales conflictivas
        const url = `https://pokeapi.co{nombreLimpio}`;

        xhr.open("GET", url, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        renderizarPokemon(data);
                    } catch (e) {
                        mostrarError("Error al procesar los datos.");
                    }
                } else {
                    mostrarError("Pokémon no encontrado o error de red.");
                }
            }
        };

        xhr.send();
    }

    function renderizarPokemon(pokemon) {
        cardLoading.classList.add("hidden");
        cardContent.classList.remove("hidden");

        // ID y Nombre
        pokeId.innerText = `#${pokemon.id.toString().padStart(3, '0')}`;
        pokeName.innerText = pokemon.name;
        
        // Imagen (Búsqueda segura del sprite)
        let imagenUrl = "";
        if (pokemon.sprites) {
            if (pokemon.sprites.other && pokemon.sprites.other["official-artwork"]) {
                imagenUrl = pokemon.sprites.other["official-artwork"].front_default;
            }
            if (!imagenUrl) {
                imagenUrl = pokemon.sprites.front_default;
            }
        }
        pokeImg.src = imagenUrl || "";

        // Tipos
        pokeTypes.innerHTML = "";
        if (pokemon.types) {
            pokemon.types.forEach(item => {
                const pill = document.createElement("span");
                pill.classList.add("type-pill", `type-${item.type.name}`);
                if(!pill.className.match(/type-(fire|water|grass|electric|normal|poison)/)) {
                    pill.classList.add("type-normal");
                }
                pill.innerText = item.type.name;
                pokeTypes.appendChild(pill);
            });
        }

        // Estadísticas Base de forma segura
        const maxStat = 150;
        let hp = 50, atk = 50, def = 50, spd = 50;

        if (pokemon.stats) {
            pokemon.stats.forEach(s => {
                if (s.stat.name === "hp") hp = s.base_stat;
                if (s.stat.name === "attack") atk = s.base_stat;
                if (s.stat.name === "defense") def = s.base_stat;
                if (s.stat.name === "speed") spd = s.base_stat;
            });
        }

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
        obtenerDatosPokemon(inputBusqueda.value);
    });

    inputBusqueda.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            obtenerDatosPokemon(inputBusqueda.value);
        }
    });

    // Forzar carga inicial con un pokémon básico en minúsculas
    obtenerDatosPokemon("pikachu");
});
