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
        // document.getElementById("modalRecetaIngredientes").innerHTML = `${ingredientes}<br>`;
        // document.getElementById("modalRecetaInstrucciones").textContent = instrucciones;
        let ingredientesList = document.getElementById("modalRecetaIngredientes");
        ingredientesList.innerHTML = "<h6>Ingredientes:</h6>";
        let ingredientesArray = ingredientes.split("\n");
        ingredientesArray.forEach(function (ingrediente) {
          if (ingrediente.trim() !== "") {
            let listItem = document.createElement("li");
            listItem.textContent = ingrediente;
            ingredientesList.appendChild(listItem);
          }
        });

       // Mostrar pasos de instrucciones en una lista desordenada
       let instruccionesList = document.getElementById("modalRecetaInstrucciones");
       instruccionesList.innerHTML = "<h6>Instrucciones:</h6>";
       let instruccionesArray = instrucciones.split("\n");
       instruccionesArray.forEach(function (paso) {
         if (paso.trim() !== "") {
           let listItem = document.createElement("li");
           listItem.textContent = paso;
           instruccionesList.appendChild(listItem);
         }
       });

        // Abrir el modal
        recetaModal.show();
      });
    });
  });


  