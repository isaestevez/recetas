$(document).ready(function () {
    // Manejar el evento de envío del formulario para agregar tarjetas manualmente
    $("#agregarRecetaForm").submit(function (event) {
        event.preventDefault(); // Evita que se envíe el formulario de forma predeterminada

        // Obtener los valores del formulario
        var titulo = $("#nombre").val();
        var imagen = $("#imagen").val(); // aca debes manejar la carga de imágenes adecuadamente
        var descripcion = $("#descripcion").val();
        var ingredientes = $("#ingredientes").val();
        var instrucciones = $("#instrucciones").val();

        // Crear una nueva tarjeta dinámica
        var nuevaTarjeta = `
            <div class="col">
                <div class="card mb-4 shadow-sm">
                    <img src="${imagen}" class="card-img-top" alt="${titulo}">
                    <div class="card-body">
                        <h5 class="card-title">${titulo}</h5>
                        <p class="card-text">${descripcion}</p>
                        <!-- Agrega más contenido de la receta aquí -->
                    </div>
                </div>
            </div>
        `;

        // Agrega la nueva tarjeta al contenedor de tarjetas dinámicas
        $("#tarjetas-container-dinamicas").append(nuevaTarjeta);

        // Limpia el formulario después de agregar la tarjeta
        $("#agregarRecetaForm")[0].reset();
    });
});

