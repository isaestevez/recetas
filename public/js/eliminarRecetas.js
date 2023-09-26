// Captura el clic en botones de eliminación
document.querySelectorAll(".eliminar-receta").forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    const recetaId = this.getAttribute("data-receta-id");
    const tabla = this.getAttribute("data-tabla"); //obtiene la tabla 

    // Muestra una confirmación con SweetAlert2 antes de eliminar la receta
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma la eliminación, realiza la solicitud AJAX
        fetch(`/eliminar-receta/${recetaId}?tabla=${tabla}`, {
          method: "GET",
        })
          .then((response) => {
            if (response.ok) {
              // Recarga la página después de eliminar la receta
              window.location.reload();
            } else {
              console.error("Error al eliminar la receta");
            }
          })
          .catch((error) => {
            console.error("Error al eliminar la receta: " + error);
          });
      }
    });
  });
});

