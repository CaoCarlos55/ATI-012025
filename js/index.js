document.addEventListener('DOMContentLoaded', async () => {
    try {
        
        const urlParams = new URLSearchParams(window.location.search);
        let lang = (urlParams.get('lang') || 'ES').toUpperCase();
        const idiomasSoportados = ['ES', 'EN', 'PT'];
        if (!idiomasSoportados.includes(lang)) {
            console.warn(`Idioma "${lang}" no soportado. Usando ES por defecto.`);
            lang = 'ES';
        }
        configurarIdioma(lang);
        

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar los datos')
    }
});
function configurarIdioma(lang){
    const idioma = document.createElement("script");
    idioma.src = `conf/config${lang}.json`;
    document.head.appendChild(idioma);
    document.head.insertBefore(idioma, document.head.firstChild);

    idioma.onload = function() {
        aplicarConfiguracion(config);
        const estudiantes = perfiles;
        window.estudiantesData = estudiantes;
        renderEstudiantes(estudiantes,config, lang);
        configBusqueda(config, lang);
    };
    
}

function aplicarConfiguracion(config) {
    if (!config) return;
  

    if (config.sitio) {
        const header = document.getElementById('header-sitio');
        if (header) {
        const [ati, ucv, periodo] = config.sitio;
        header.innerHTML = `${ati}<small class="ucv">${ucv}</small> ${periodo}`;
        }
    }
  

    const mapearId = {
        'saludo': config.saludo,
        'nombre': config.nombre,
        'buscar': config.buscar,
        'copyRight': config.copyRight,
        'sinResultado': config.sinResultado
    };
  
    for (const [id, value] of Object.entries(mapearId)) {
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

function renderEstudiantes(estudiantes, config, lang, query = '') {
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

        // Crear enlace que envuelve todo el contenido
        const enlacePerfil = document.createElement('a');
        enlacePerfil.href = `perfil.html?ci=${estudiante.ci}&lang=${lang || 'ES'}`;
        enlacePerfil.className = 'enlace-perfil';
        
        // Mantener el contenido original pero dentro del enlace
        enlacePerfil.innerHTML = `
            <img src="${estudiante.imagen}" 
                 alt="${estudiante.nombre}" 
                 class="est"> 
            <p>${estudiante.nombre}</p>
        `;

        estudianteElement.appendChild(enlacePerfil);
        listaEstudiantes.appendChild(estudianteElement);
    });
}

function configBusqueda(config, lang) {
    const entrada = document.getElementById('nombre');
    const boton = document.getElementById('buscar');
    

    entrada.addEventListener('input', () => {
        renderEstudiantes(window.estudiantesData, config, lang, entrada.value.trim());
    });

    boton.addEventListener('click', () => {
        renderEstudiantes(window.estudiantesData, config, lang, entrada.value.trim());
    });
    
    entrada.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
        renderEstudiantes(window.estudiantesData, config, lang, entrada.value.trim());
        }
    });
}
function mostrarError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.prepend(errorElement);
}

 