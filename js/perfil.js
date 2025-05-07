function cambiarColor(link) {
    link.style.color = 'red'; 
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const ci = urlParams.get('ci') || '28655925';
        let lang = urlParams.get('lang') || 'ES';

        const idiomasSoportados = ['ES', 'EN', 'PT'];
        if (!idiomasSoportados.includes(lang.toUpperCase())) {
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
        mostrarInterfaz(config)
        
        

        if (ci) {
    
            const estudiantes = perfiles;
            const estudiante = estudiantes.find(e => e.ci === ci);

            const info = document.createElement("script");
            info.src = `${estudiante["ci"]}/perfil.json`;
            document.head.appendChild(info);
            document.head.insertBefore(info, document.head.firstChild);

            if (estudiante) {
                mostrarPerfil(estudiante);
            }

            info.onload = function(){
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

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('nombre-perfil').textContent = 'Error al cargar el perfil';
    }

    function mostrarPerfil(estudiante) {

        document.title = estudiante.nombre;
        document.getElementById('nombre-perfil').textContent = estudiante.nombre;
        const fotoPerfil = document.getElementById('foto-perfil');
        fotoPerfil.src = estudiante.imagen;
        fotoPerfil.alt = `Foto de ${estudiante.nombre}`;
   


    }
    function mostrarInterfaz(config) {

        document.getElementById('conf_color').textContent = config.color;
        document.getElementById('conf_libro').textContent = config.libro;
        document.getElementById('conf_musica').textContent = config.musica;
        document.getElementById('conf_video_juego').textContent = config.video_juego;
        document.getElementById('conf_lenguajes').textContent = config.lenguajes;
        
    }
});