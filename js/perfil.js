function cambiarColor(link) {
    console.log("Caso 1 - this en función tradicional invocada desde el HTML:", this);
    link.style.color = 'red'; 
}
const mensajeError = {
    ES: {
        title: "Error - Perfil no encontrado",
        message: "No se encontró un perfil asociado a esta cédula de identidad."
    },
    EN: {
        title: "Error - Profile not found",
        message: "No profile was found associated with this ID number."
    },
    PT: {
        title: "Erro - Perfil não encontrado",
        message: "Nenhum perfil foi encontrado associado a este número de identidade."
    }
};


document.addEventListener('DOMContentLoaded', async () => {
    console.log("Caso 3 - this dentro de función flecha (DOMContentLoaded):", this);
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const ci = urlParams.get('ci');
        let lang = urlParams.get('lang') || 'ES';

        const idiomasSoportados = ['ES', 'EN', 'PT'];
        if (!idiomasSoportados.includes(lang.toUpperCase())) {
            console.warn(`Idioma "${lang}" no soportado. Usando ES por defecto.`);
            lang = 'ES';
        }
        configurarIdioma(lang, perfiles, ci);

        
    } catch (error) {
        const urlParams = new URLSearchParams(window.location.search);
        let lang = urlParams.get('lang') || 'ES';
        console.error('Error:', error);
        mostrarError(lang);
    }
    
    function configurarIdioma(lang, perfiles,ci){
        const idioma = document.createElement("script");
        idioma.src = `conf/config${lang}.json`;
        document.head.appendChild(idioma);
        document.head.insertBefore(idioma, document.head.firstChild);
        idioma.onload = function() {
            mostrarInterfaz(config);
            if (ci) {
                cargarEstudiante(ci, perfiles, lang);
            }else{
                mostrarError(lang);
                return;
            }
        };
        
    }
    function cargarEstudiante(ci, perfiles, lang) {
        const estudiantes = perfiles;
        const estudiante = estudiantes.find(e => e.ci === ci);

        if (!estudiante) {
            mostrarError(lang);
            return;
        }
        const info = document.createElement("script");
        info.src = `${estudiante["ci"]}/perfil.json`;
        document.head.appendChild(info);
        document.head.insertBefore(info, document.head.firstChild);

        if (estudiante) {
            mostrarPerfil(estudiante);
        }

        info.onload = function(){
            console.log("Caso 2 - this dentro de función onload (tradicional):", this);
            document.getElementById('color_text').textContent = perfil.color;
            document.getElementById('descripcion').textContent = perfil.descripcion;
            document.getElementById('libro-text').textContent = perfil.libro;
            document.getElementById('musica-text').textContent = perfil.musica;
            document.getElementById('lenguaje-text').textContent = perfil.lenguajes.join(", ");
            document.getElementById('video-text').textContent = perfil.video_juego;
            
            
            const emailTextElement = document.getElementById('email-text');
            const emailLinkElement = document.getElementById('email');

            const textoBase = config.email; 
            const partes = textoBase.split('[email]');

            emailTextElement.innerHTML = '';

            
            if (partes[0]) {
                emailTextElement.appendChild(document.createTextNode(partes[0]));
            }
            
            
            emailLinkElement.textContent = perfil.email;
            emailLinkElement.href = `mailto:${perfil.email}`;
            emailTextElement.appendChild(emailLinkElement);
        
            if (partes[1]) {
                emailTextElement.appendChild(document.createTextNode(partes[1]));
            }
        }
    }

    function mostrarPerfil(estudiante) {

        document.title = estudiante.nombre;
        document.getElementById('nombre-perfil').textContent = estudiante.nombre;
        const fotoPerfil = document.getElementById('foto-perfil');
        fotoPerfil.alt = `Foto de ${estudiante.nombre}`;
        if(estudiante.nombre === "Carlos Cao") {
            fotoPerfil.srcset = `28655925/28655925Pequena.png 360w, 
                                28655925/28655925Grande.png 960w`;
            fotoPerfil.sizes = "(max-width: 768px) 360px, (min-width: 769px) 960px";
            fotoPerfil.src = estudiante.imagen;
        } 
        else {
            fotoPerfil.removeAttribute('srcset');
            fotoPerfil.removeAttribute('sizes');
            fotoPerfil.src = estudiante.imagen; 
        }


    }
    function mostrarInterfaz(config) {

        document.getElementById('conf_color').textContent = config.color;
        document.getElementById('conf_libro').textContent = config.libro;
        document.getElementById('conf_musica').textContent = config.musica;
        document.getElementById('conf_video_juego').textContent = config.video_juego;
        document.getElementById('conf_lenguajes').textContent = config.lenguajes;
        
    }
});

function mostrarError(lang) {
    const langUpper = lang.toUpperCase();
    const messages = mensajeError[langUpper] || mensajeError.ES;
    
    document.title = messages.title;
    
    const principalDiv = document.querySelector('.Principal');
    if (principalDiv) {
        if(lang.toUpperCase() === 'EN'){
            principalDiv.innerHTML = `
            <div class="error-container">
                <h1>${messages.title}</h1>
                <p>${messages.message}</p>
                <a href="index.html?lang=EN">'Go back to home'</a>
            </div>
        `;
        }else if(lang.toUpperCase() === 'PT'){
            principalDiv.innerHTML = `
            <div class="error-container">
                <h1>${messages.title}</h1>
                <p>${messages.message}</p>
                <a href="index.html?lang=PT">'Voltar para a página inicial'</a>
            </div>
        `;
        }else{
            principalDiv.innerHTML = `
            <div class="error-container">
                <h1>${messages.title}</h1>
                <p>${messages.message}</p>
                <a href="index.html">'Volver a la página principal'</a>
            </div>
        `;
        }
        
    }
    

    const style = document.createElement('style');
    style.textContent = `
        .Principal {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .error-container {
            text-align: center;
            margin-top: 50px;
            padding: 20px;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 5px;
            color: #721c24;
        }
        .error-container h1 {
            color: #721c24;
        }
        .error-container a {
            display: inline-block;
            margin-top: 20px;
            color: #004085;
            text-decoration: none;
        }
        .error-container a:hover {
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);
}