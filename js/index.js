
document.addEventListener('DOMContentLoaded', async () => {
    try {

      const response = await fetch('conf/configES.json');
      if (!response.ok) throw new Error('Error al cargar la configuración');
      
      const config = await response.json();
      applyConfig(config);

      
      
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

 