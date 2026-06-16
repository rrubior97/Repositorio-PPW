document.addEventListener("DOMContentLoaded", () => {
    const inputBusqueda = document.getElementById("pokemon-input");
    const botonBuscar = document.getElementById("search-btn");
    
    const cardLoading = document.getElementById("card-loading");
    const cardContent = document.getElementById("card-content");
    
    // Componentes de la tarjeta
    const pokeId = document.getElementById("poke-id");
    const pokeImg = document.getElementById("poke-img");
    const pokeName = document.getElementById("poke-name");
    const pokeTypes = document.getElementById("poke-types");
    
    // Barras de estadísticas
    const statHp = document.getElementById("stat-hp");
    const statAtk = document.getElementById("stat-atk");
    const statDef = document.getElementById("stat-def");
    const statSpd = document.getElementById("stat-spd");

    // 1. FUNCIÓN PRINCIPAL DE AJAX
    function obtenerDatosPokemon(pokemon) {
        cardLoading.classList.remove("hidden");
        cardContent.classList.add("hidden");
        cardLoading.innerText = "Buscando en la base de datos...";

        const xhr = new XMLHttpRequest();
        // Forzamos la consulta limpia a la API original
        const url = `https://pokeapi.co{pokemon.toLowerCase().trim()}`;

        xhr.open("GET", url, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        renderizarPokemon(data);
                    } catch (e) {
                        mostrarError();
                    }
                } else {
                    mostrarError();
                }
            }
        };

        xhr.send();
    }

    // 2. FUNCIÓN PARA CARGAR LOS DATOS EN LA INTERFAZ (Soportando nombres traducidos o nativos)
    function renderizarPokemon(pokemon) {
        cardLoading.classList.add("hidden");
        cardContent.classList.remove("hidden");

        // ID y Nombre
        const idOriginal = pokemon.id || pokemon.id_pokemon || 1;
        pokeId.innerText = `#${idOriginal.toString().padStart(3, '0')}`;
        pokeName.innerText = pokemon.name || "Desconocido";
        
        // Imagen segura (revisando múltiples propiedades por si acaso)
        let urlImagen = "";
        if (pokemon.sprites) {
            if (pokemon.sprites.other && pokemon.sprites.other["official-artwork"]) {
                urlImagen = pokemon.sprites.other["official-artwork"].front_default;
            }
            if (!urlImagen) urlImagen = pokemon.sprites.front_default;
        }
        pokeImg.src = urlImagen || "https://githubusercontent.com";

        // Tipos (Maneja tanto 'types' en inglés como 'tipos' en español)
        pokeTypes.innerHTML = "";
        const listaTipos = pokemon.types || pokemon.tipos || [];
        
        listaTipos.forEach(item => {
            const infoTipo = item.type || item.tipo;
            if (infoTipo) {
                const pill = document.createElement("span");
                const nombreTipo = infoTipo.name || infoTipo.nombre || "normal";
                pill.classList.add("type-pill", `type-${nombreTipo}`);
                
                if(!pill.className.match(/type-(fire|water|grass|electric|normal|poison)/)) {
                    pill.classList.add("type-normal");
                }
                pill.innerText = nombreTipo;
                pokeTypes.appendChild(pill);
            }
        });

        // Estadísticas Base (Maneja tanto 'stats' como 'estadisticas')
        const listaStats = pokemon.stats || pokemon.estadisticas || [];
        const maxStat = 150;

        // Inicializamos valores por defecto
        let hp = 50, atk = 50, def = 50, spd = 50;

        // Buscamos los valores mapeando los nombres posibles
        listaStats.forEach(item => {
            const infoStat = item.stat || item.estadistica;
            const nombreStat = infoStat ? (infoStat.name || infoStat.nombre || "") : "";
            const valorStat = item.base_stat || item.valor_base || 50;

            if (nombreStat === "hp") hp = valorStat;
            if (nombreStat === "attack" || nombreStat === "ataque") atk = valorStat;
            if (nombreStat === "defense" || nombreStat === "defensa") def = valorStat;
            if (nombreStat === "speed" || nombreStat === "velocidad") spd = valorStat;
        });

        // Asignamos anchos visuales
        statHp.style.width = `${Math.min((hp / maxStat) * 100, 100)}%`;
        statAtk.style.width = `${Math.min((atk / maxStat) * 100, 100)}%`;
        statDef.style.width = `${Math.min((def / maxStat) * 100, 100)}%`;
        statSpd.style.width = `${Math.min((spd / maxStat) * 100, 100)}%`;
    }

    // 3. MANEJO DE ERRORES
    function mostrarError() {
        cardContent.classList.add("hidden");
        cardLoading.classList.remove("hidden");
        cardLoading.innerHTML = `<span style="color: #ef5350; font-weight: bold;">❌ Error al cargar datos.</span><br><small>Intenta de nuevo con otro Pokémon.</small>`;
    }

    // 4. EVENTOS
    botonBuscar.addEventListener("click", () => {
        if (inputBusqueda.value !== "") {
            obtenerDatosPokemon(inputBusqueda.value);
        }
    });

    inputBusqueda.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && inputBusqueda.value !== "") {
            obtenerDatosPokemon(inputBusqueda.value);
        }
    });

    // Carga inicial segura
    obtenerDatosPokemon("charizard");
});
