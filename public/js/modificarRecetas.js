document.addEventListener("DOMContentLoaded", function () {
  var recetaId; // Variable para almacenar recetaId
  var tabla; // Variable para almacenar tabla

  // Evento para abrir el modal de modificación
  var modificarRecetaButtons = document.querySelectorAll(".modificar-receta");
  modificarRecetaButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      recetaId = this.getAttribute("data-bs-receta-id");
      // console.log("recetaId:", recetaId);
      tabla = this.getAttribute("data-bs-tabla");
      // console.log("tabla:", tabla);

      var nombre = this.getAttribute("data-bs-titulo");
      const descripcion = this.getAttribute("data-bs-descripcion"); // Esta es tipo_receta
      const dificultad = this.getAttribute("data-bs-dificultad");
      const tiempo = this.getAttribute("data-bs-tiempo");
      const ingredientes = this.getAttribute("data-bs-ingredientes");
      const instrucciones = this.getAttribute("data-bs-instrucciones");
   

      // Rellena los campos del formulario del modal con los datos actuales
      document.getElementById("nombre").value = nombre;
      document.getElementById("tipo_receta").value = descripcion;
      document.getElementById("dificultad_receta").value = dificultad;
      document.getElementById("tiempo_coccion").value = tiempo;
      document.getElementById("ingredientes").value = ingredientes;
      document.getElementById("instrucciones").value = instrucciones;
    
     

      // Abre el modal
      var modal = new bootstrap.Modal(document.getElementById("modalModificarReceta"));
      modal.show();
    });
  });

  // Evento para manejar el envío del formulario
  var formModificarReceta = document.getElementById("formModificarReceta");
  formModificarReceta.addEventListener("submit", function (e) {
    e.preventDefault();

    // Verifica si recetaId está definida
    if (typeof recetaId === 'undefined') {
      // Maneja el caso donde recetaId no está definida (puedes mostrar un mensaje de error)
      return;
    }

    // Obtén los nuevos datos de la receta desde el formulario
    var nuevosDatos = {
      nombre: document.getElementById("nombre").value,
      tipo_receta: document.getElementById("tipo_receta").value,
      dificultad_receta: document.getElementById("dificultad_receta").value,
      tiempo_coccion: document.getElementById("tiempo_coccion").value,
      ingredientes: document.getElementById("ingredientes").value,
      instrucciones: document.getElementById("instrucciones").value,
    
    };
//--------------------------------------------------------------------



//-----------------------------------------------------------
    

    console.log(recetaId); 
    // Envía los nuevos datos al servidor para actualizar la receta
    fetch(`/modificar-receta/${recetaId}?tabla=${tabla}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( nuevosDatos ),
      
      
    })
      .then(function (response) {
        return response.text();
      })
      .then(function (response) {
        console.log("Respuesta del servidor:", response);
        if (response === "Receta modificada con éxito") {
          var modal = new bootstrap.Modal(document.getElementById("modalModificarReceta"));
          modal.hide();
          Swal.fire({
            title: "Receta Modificada",
            text: "La receta ha sido modificada con éxito.",
            icon: "success",
          });
          location.reload();
        } else {
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al modificar la receta.",
            icon: "error",
          });
        }
      });
  });
});





