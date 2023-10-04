
  // Obtener la página actual
  const currentPage = "<%= currentPage %>";
  console.log("Página actual:", currentPage);

  // Obtener todos los enlaces con la clase "active-link"
  const links = document.querySelectorAll('.active-link');

  // Recorrer los enlaces y agregar la clase "active" al enlace coincidente
  links.forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

