const appState = {
    lang: 'ES',
    perfiles: [],
    config: null,
    currentView: 'list',
    currentProfileId: null
};


const appContainer = document.getElementById('app-container');
const langSelector = document.getElementById('lang-selector');
const copyrightElement = document.getElementById('copyRight');
const saludoElement = document.getElementById('saludo');
const headerSitioElement = document.getElementById('header-sitio');


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('datos/index.json');
        appState.perfiles = await response.json();
        await changeLanguage(appState.lang);

        handleRouteChange();
        window.addEventListener('hashchange', handleRouteChange);

        const entrada = document.getElementById('nombre');
        const boton = document.getElementById('buscar');
        
        const handleSearch = () => {
            renderListView(entrada.value.trim());
        };
        
        entrada.addEventListener('input', handleSearch);
        boton.addEventListener('click', handleSearch);
        entrada.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
        
        langSelector.addEventListener('change', handleLanguageChange);
        document.addEventListener('click', handleAppNavigation);
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        renderError('Error al cargar los datos');
    }
});
function handleRouteChange() {
    const hash = window.location.hash.substring(1); 

    const perfilMatch = hash.match(/^\/perfil\/(\d+)$/);
    if (perfilMatch) {
        const ci = perfilMatch[1];
        renderProfileView(ci);
        return;
    }
    
    if (hash === '' || hash === '/') {
        renderListView();
        return;
    }
    

    renderError('Página no encontrada');
}

async function changeLanguage(newLang) {
    appState.lang = newLang;
    langSelector.value = newLang;
    
    try {
        const response = await fetch(`conf/config${newLang}.json`);
        appState.config = await response.json();
        
        copyrightElement.textContent = appState.config.copyRight;
        saludoElement.textContent = appState.config.saludo;
        
        if (appState.config.sitio) {
            const [ati, ucv, periodo] = appState.config.sitio;
            headerSitioElement.innerHTML = `${ati}<small class="ucv">${ucv}</small> ${periodo}`;
        }
        
        const nombreInput = document.getElementById('nombre');
        if (nombreInput) {
            nombreInput.placeholder = appState.config.nombre;
        }
        
        const buscarButton = document.getElementById('buscar');
        if (buscarButton) {
            buscarButton.textContent = appState.config.buscar;
        }

        handleRouteChange();
    } catch (error) {
        console.error('Error al cambiar idioma:', error);
        renderError('Error al cargar la configuración de idioma');
    }
}

function toggleCommonElements(show = true) {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    
    if (show) {
        header.classList.remove('hidden');
        footer.classList.remove('hidden');
        document.body.classList.remove('perfil-view');
    } else {
        header.classList.add('hidden');
        footer.classList.add('hidden');
        document.body.classList.add('perfil-view');
    }
}

function renderListView(query = '') {
    appState.currentView = 'list';
    document.title = appState.config.sitio.join(' ');
    toggleCommonElements(true);
    
    let html = `
        <section>
            <ul class="lista-estudiante" id="students-list">
    `;
    
    const estudiantesFiltrados = query 
        ? appState.perfiles.filter(e => 
            e.nombre.toLowerCase().includes(query.toLowerCase()))
        : appState.perfiles;
    
    if (query && estudiantesFiltrados.length === 0) {
        const mensaje = appState.config.sinResultado.replace('[query]', query);
        html += `<li class="sin-resultado">${mensaje}</li>`;
    } else {
        estudiantesFiltrados.forEach(estudiante => {
            html += `
                <li class="estudiante">
                    <a href="#/perfil/${estudiante.ci}" class="enlace-perfil" data-ci="${estudiante.ci}">
                        <img src="perfiles/${estudiante.imagen}" alt="${estudiante.nombre}" class="est">
                        <p>${estudiante.nombre}</p>
                    </a>
                </li>
            `;
        });
    }
    
    html += `</ul></section>`;
    appContainer.innerHTML = html;
}

async function renderProfileView(ci) {

    const targetHash = `#/perfil/${ci}`;
    if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
    }
    
    appState.currentView = 'profile';
    appState.currentProfileId = ci;
    toggleCommonElements(false);
    
    try {

        const estudiante = appState.perfiles.find(e => e.ci === ci);
        if (!estudiante) {
            renderError('Perfil no encontrado');
            return;
        }
        
        const perfilResponse = await fetch(`perfiles/${ci}/perfil.json`);
        const perfil = await perfilResponse.json();
        document.title = perfil.nombre;
        
        appContainer.innerHTML = `
            <div class="perf">
                <div class="back-container">
                    <button id="btn-back" class="back-button">
                        ← ${appState.config.home}
                    </button>
                    <div class="language-selector-container">
                        <select id="profile-lang-selector">
                            <option value="ES" ${appState.lang === 'ES' ? 'selected' : ''}>ES</option>
                            <option value="EN" ${appState.lang === 'EN' ? 'selected' : ''}>EN</option>
                            <option value="PT" ${appState.lang === 'PT' ? 'selected' : ''}>PT</option>
                        </select>
                    </div>
                </div>
                
                <div class="Principal">
                    <div class="Cuadro-Imagen">
                        <img id="foto-perfil" src="perfiles/${estudiante.imagen}" alt="${perfil.nombre}" class="Perfil">
                    </div>
                    
                    <div class="Cuadro"> 
                        <h2 id="nombre-perfil" class="nombre">${perfil.nombre}</h2>
                        <div class="Texto">
                            <p><i id="descripcion">${perfil.descripcion}</i></p>
                        </div>
                        
                        <table class="tabla">
                            <tr>
                                <td class="tabla-texto">${appState.config.color}</td>
                                <td>${perfil.color}</td>
                            </tr>
                            <tr>
                                <td class="tabla-texto">${appState.config.libro}</td>
                                <td>${perfil.libro}</td>
                            </tr>
                            <tr>
                                <td class="tabla-texto">${appState.config.musica}</td>
                                <td>${perfil.musica}</td>
                            </tr>
                            <tr>
                                <td class="tabla-texto">${appState.config.video_juego}</td>
                                <td>${perfil.video_juego}</td>
                            </tr>
                            <tr>
                                <td class="tabla-texto"><b>${appState.config.lenguajes}</b></td>
                                <td><b>${perfil.lenguajes.join(', ')}</b></td>
                            </tr>
                        </table>
                        <p class="texto-correo">
                            ${appState.config.email.replace('[email]', 
                            `<a href="mailto:${perfil.email}" class="correo" onclick="cambiarColor(this)" >${perfil.email} </a>`)}
                        </p>
                    </div>
                </div>
            </div>
        `;
        

        document.getElementById('btn-back').addEventListener('click', () => {
            window.location.hash = '#/';
        });
        

        const profileLangSelector = document.getElementById('profile-lang-selector');
        profileLangSelector.value = appState.lang;
        profileLangSelector.addEventListener('change', function() {
            changeLanguage(this.value); 
        });
        
    } catch (error) {
        console.error('Error al cargar el perfil:', error);
        renderError('Error al cargar el perfil del estudiante');
    }
}

function handleAppNavigation(e) {
    const enlacePerfil = e.target.closest('.enlace-perfil');
    if (enlacePerfil) {
        e.preventDefault();
        const ci = enlacePerfil.dataset.ci;
        renderProfileView(ci);
    }
}

function handleLanguageChange() {
    changeLanguage(this.value);
}

function renderError(message) {
    appContainer.innerHTML = `
        <div class="error-container">
            <h1>Error</h1>
            <p>${message}</p>
            <button id="btn-back-error" class="back-button">${appState.config?.home || 'Volver'}</button>
        </div>
    `;
    
    document.getElementById('btn-back-error').addEventListener('click', () => {
        renderListView();
    });
}

function cambiarColor(link) {
    console.log("Caso 1 - this en función tradicional invocada desde el HTML:", this);
    link.style.color = 'red'; 
}