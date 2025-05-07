
document.addEventListener('DOMContentLoaded', async () => {
    try {
        
        const urlParams = new URLSearchParams(window.location.search);
        let lang = (urlParams.get('lang') || 'ES').toUpperCase();
        const idiomasSoportados = ['ES', 'EN', 'PT'];
        if (!idiomasSoportados.includes(lang)) {
            console.warn(`Idioma "${lang}" no soportado. Usando ES por defecto.`);
            lang = 'ES';
        }
        let config;
        if(lang.toUpperCase()== 'PT'){
            config = configPT;
        }else if(lang.toUpperCase() == 'EN'){
            config = configEN;
        }else if(lang.toUpperCase() == 'ES'){
            config = configES;
        }
        applyConfig(config);

        const estudiantes = perfiles;

        window.estudiantesData = estudiantes;

        renderEstudiantes(estudiantes,config);

        setupSearch(config);

    } catch (error) {
        console.error('Error:', error);
        showError('Error al cargar los datos')
    }
});


function applyConfig(config) {
    if (!config) return;
  

    if (config.sitio) {
        const header = document.getElementById('header-sitio');
        if (header) {
        const [ati, ucv, periodo] = config.sitio;
        header.innerHTML = `${ati}<small class="ucv">${ucv}</small> ${periodo}`;
        }
    }
  

    const idMappings = {
        'saludo': config.saludo,
        'nombre': config.nombre,
        'buscar': config.buscar,
        'copyRight': config.copyRight,
        'sinResultado': config.sinResultado
    };
  
    for (const [id, value] of Object.entries(idMappings)) {
        if (value) {
            const element = document.getElementById(id);
            if (element) {
                if (id === 'nombre') {
                element.placeholder = value;
                } else {
                element.textContent = value;
                }
            }
        }
    }
}

function renderEstudiantes(estudiantes, config, query = '') {
    const listaEstudiantes = document.querySelector('.lista-estudiante');
    if (!listaEstudiantes) return;

    listaEstudiantes.innerHTML = '';

    const estudiantesFiltrados = query 
    ? estudiantes.filter(e => 
        e.nombre.toLowerCase().includes(query.toLowerCase()))
    : estudiantes;

    if (query && estudiantesFiltrados.length === 0) {
    const sinResultado = document.createElement('li');
    sinResultado.className = 'sin-resultado';
    const mensaje = config.sinResultado.replace('[query]', query); 
    sinResultado.textContent = mensaje;
    listaEstudiantes.appendChild(sinResultado);
    return;
    }

    estudiantesFiltrados.forEach(estudiante => {
        const estudianteElement = document.createElement('li');
        estudianteElement.className = 'estudiante';

        estudianteElement.innerHTML = `
        <img src="${estudiante.imagen}" 
            alt="${estudiante.nombre}" 
            class="est"> 
        <p>${estudiante.nombre}</p>
        `;

        listaEstudiantes.appendChild(estudianteElement);
    });
}

function setupSearch(config) {
    const searchInput = document.getElementById('nombre');
    const searchButton = document.getElementById('buscar');
    

    
    searchButton.addEventListener('click', () => {
        renderEstudiantes(window.estudiantesData, config, searchInput.value.trim());
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
        renderEstudiantes(window.estudiantesData, config, searchInput.value.trim());
        }
    });
}
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.prepend(errorElement);
}

 