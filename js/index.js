
document.addEventListener('DOMContentLoaded', async () => {
    try {

      const response = await fetch('conf/configES.json');
      if (!response.ok) throw new Error('Error al cargar la configuración');
      
      const config = await response.json();
      applyConfig(config);

      const estudiantesResponse = await fetch('datos/index.json');
      if (!estudiantesResponse.ok) throw new Error('Error al cargar estudiantes');
      const estudiantes = await estudiantesResponse.json();
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

    
  
    // 3. Configuración adicional para otros elementos
    // (Puedes agregar más lógica aquí según necesites)
}

function renderEstudiantes(estudiantes) {
    const listaEstudiantes = document.querySelector('.lista-estudiante');
    if (!listaEstudiantes) return;
  
    // Limpiar lista existente
    listaEstudiantes.innerHTML = '';
  
    // Crear elementos para cada estudiante
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


 