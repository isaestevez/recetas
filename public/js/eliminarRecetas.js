document.addEventListener('DOMContentLoaded', () => {
    // Agrega un evento clic al botón que abre el modal
    const openModalButton = document.querySelector('.open-modal-button');
  
    // Agregar un manejador de eventos clic al botón
    openModalButton.addEventListener('click', () => {
      // Obtiene el ID de la receta desde el atributo 'data-bs-receta-id' del botón
      const recetaId = openModalButton.getAttribute('data-bs-receta-id');
  
      // Asigna el ID de la receta al botón "Eliminar Receta" dentro del modal
      const eliminarRecetaButton = document.getElementById('eliminarRecetaButton');
      eliminarRecetaButton.setAttribute('data-bs-receta-id', recetaId);
    });
  
    // Agrega un evento clic al botón "Eliminar Receta" dentro del modal
    const eliminarRecetaBtn = document.getElementById('eliminarRecetaButton');
  
    eliminarRecetaBtn.addEventListener('click', () => {
      // Obtiene el ID de la receta desde el atributo 'data-bs-receta-id' del botón
      const recetaId = eliminarRecetaBtn.getAttribute('data-bs-receta-id');
  
      // Realiza una solicitud POST al servidor para eliminar la receta con el ID obtenido
      fetch(`/eliminar-receta/${recetaId}`, {
        method: 'POST',
      })
        .then((response) => {
          if (response.status === 200) {
            // La receta se eliminó correctamente, redirigir a la página principal
            window.location.href = '/';
          } else if (response.status === 403) {
            // No tienes permiso para eliminar esta receta, muestra un mensaje de error
            console.error('No tienes permiso para eliminar esta receta.');
          } else {
            // Hubo un error al eliminar la receta, muestra un mensaje de error genérico
            console.error('Error al eliminar la receta');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });
  