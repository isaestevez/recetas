// Obtén todas las tarjetas de recetas dinámicas
const recetaCards = document.querySelectorAll('.card-link');

// Agrega un evento clic a cada tarjeta
recetaCards.forEach((card) => {
  card.addEventListener('click', () => {
    // Obtén el ID de la receta desde el atributo "data" de la tarjeta
    const recetaId = card.getAttribute('data-receta-id');

    // Abre el modal correspondiente a la receta
    $('#recetaModal' + recetaId).modal('show');
  });
});









