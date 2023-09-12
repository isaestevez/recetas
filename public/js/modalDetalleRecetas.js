  document.addEventListener("DOMContentLoaded", function () {
    const recetaModal = new bootstrap.Modal(document.getElementById("recetaModal"));

    // Manejar el evento de clic en cualquier tarjeta con la clase 'card-link'
    const cardLinks = document.querySelectorAll(".card-link");

    cardLinks.forEach((cardLink) => {
      cardLink.addEventListener("click", function (event) {
        event.preventDefault();

        const titulo = this.getAttribute("data-bs-titulo");
        const imagen = this.getAttribute("data-bs-imagen");
        const descripcion = this.getAttribute("data-bs-descripcion");
        const ingredientes = this.getAttribute("data-bs-ingredientes");
        const instrucciones = this.getAttribute("data-bs-instrucciones");


        // Actualizar el contenido del modal con los datos de la tarjeta clicada
        document.getElementById("modalRecetaTitulo").textContent = titulo;
        document.getElementById("modalRecetaImagen").src = imagen;
        document.getElementById("modalRecetaDescripcion").textContent = descripcion;
        document.getElementById("modalRecetaIngredientes").innerHTML = `${ingredientes}<br>`;
        document.getElementById("modalRecetaInstrucciones").textContent = instrucciones;

        // Abrir el modal
        recetaModal.show();
      });
    });
  });


  