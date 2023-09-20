document.addEventListener("DOMContentLoaded", function () {
  const inputSearch = document.getElementById("inputSearch");
  const tarjetasReceta = document.querySelectorAll(".card-link");

  inputSearch.addEventListener("input", function () {
    const query = inputSearch.value.trim().toLowerCase();

    tarjetasReceta.forEach((tarjeta) => {
      const titulo = tarjeta.getAttribute("data-bs-titulo").toLowerCase();
      const descripcion = tarjeta.getAttribute("data-bs-descripcion").toLowerCase();
      const tarjetaPadre = tarjeta.closest(".col");

      if (titulo.includes(query) || descripcion.includes(query)) {
        tarjetaPadre.style.display = "";
      } else {
        tarjetaPadre.style.display = "none";
      }
    });
  });
});