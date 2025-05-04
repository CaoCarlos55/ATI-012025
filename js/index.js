
document.addEventListener('DOMContentLoaded', async () => {
  try {
      
      const configResponse = await fetch('conf/configES.json');
      if (!configResponse.ok) throw new Error('Error al cargar la configuración');
      
      const configText = await configResponse.text();
      const configJsonStr = configText.match(/\{.*\}/s)[0]; 
      const config = JSON.parse(configJsonStr); 
      applyConfig(config);

   
      const estudiantesResponse = await fetch('datos/index.json');
      if (!estudiantesResponse.ok) throw new Error('Error al cargar estudiantes');
      
      const estudiantesText = await estudiantesResponse.text();
      const estudiantesJsonStr = estudiantesText.match(/\[.*\]/s)[0]; 
      const estudiantes = JSON.parse(estudiantesJsonStr);

      renderEstudiantes(estudiantes);
  } catch (error) {
      console.error('Error:', error);
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

function renderEstudiantes(estudiantes) {
    const listaEstudiantes = document.querySelector('.lista-estudiante');
    if (!listaEstudiantes) return;

    listaEstudiantes.innerHTML = '';
  
    estudiantes.forEach((estudiante, index) => {
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


 