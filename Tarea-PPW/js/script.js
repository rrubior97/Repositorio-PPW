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

    // 1. FUNCIÓN PRINCIPAL DE AJAX (Con XMLHttpRequest según lo visto en clases)
    function obtenerDatosPokemon(pokemon) {
        // Mostrar estado de carga
        cardLoading.classList.remove("hidden");
        cardContent.classList.add("hidden");
        cardLoading.innerText = "Buscando en la base de datos...";

        const xhr = new XMLHttpRequest();
        const url = `https://pokeapi.co{pokemon.toLowerCase().trim()}`;

        xhr.open("GET", url, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    renderizarPokemon(data);
                } else {
                    mostrarError();
                }
            }
        };

        xhr.send();
    }

    // 2. FUNCIÓN PARA CARGAR LOS DATOS EN LA INTERFAZ
    function renderizarPokemon(pokemon) {
        // Ocultar carga y mostrar contenido
        cardLoading.classList.add("hidden");
        cardContent.classList.remove("hidden");

        // Datos Básicos
        pokeId.innerText = `#${pokemon.id.toString().padStart(3, '0')}`;
        pokeName.innerText = pokemon.name;
        
        // Imagen con fallback por si no tiene sprite oficial
        pokeImg.src = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;

        // Renderizar Tipos (Limpiando previos)
        pokeTypes.innerHTML = "";
        pokemon.types.forEach(item => {
            const pill = document.createElement("span");
            pill.classList.add("type-pill", `type-${item.type.name}`);
            // Si el tipo no tiene un color CSS definido, hereda por defecto un gris tipo-normal
            if(!pill.className.match(/type-(fire|water|grass|electric|normal|poison)/)) {
                pill.classList.add("type-normal");
            }
            pill.innerText = item.type.name;
            pokeTypes.appendChild(pill);
        });

        // Calcular porcentajes de estadísticas base (Máximo estimado de 150 para la barra visual)
        const maxStat = 150;
        statHp.style.width = `${Math.min((pokemon.stats[0].base_stat / maxStat) * 100, 100)}%`;
        statAtk.style.width = `${Math.min((pokemon.stats[1].base_stat / maxStat) * 100, 100)}%`;
        statDef.style.width = `${Math.min((pokemon.stats[2].base_stat / maxStat) * 100, 100)}%`;
        statSpd.style.width = `${Math.min((pokemon.stats[5].base_stat / maxStat) * 100, 100)}%`;
    }

    // 3. MANEJO DE ERRORES
    function mostrarError() {
        cardContent.classList.add("hidden");
        cardLoading.classList.remove("hidden");
        cardLoading.innerHTML = `<span style="color: #ef5350; font-weight: bold;">❌ Pokémon no encontrado.</span><br><small>Intenta con otro nombre o ID numérico.</small>`;
    }

    // 4. EVENTOS DE CONTROLADORES
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

    // Carga inicial por defecto (Pikachu) para que la interfaz no empiece vacía
    obtenerDatosPokemon("pikachu");
});
