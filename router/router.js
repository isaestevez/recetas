const express = require("express");
const router = express.Router();
// Importar el controlador y multer
const authController = require("../controllers/authController.js");
const connection = require("../database/db.js");


//router para las vistas
router.get("/", authController.isAuthenticated, (req, res) => {
  // Consulta SQL para obtener todas las recetas de la base de datos mediante el formulario
  const sql = "SELECT * FROM recetas";

  // Consulta SQL para obtener todas las recetas ingresadas mediante el formulario
  const sqlDB = "SELECT * FROM recetas_base_datos";

  // Arreglos para almacenar recetas
  let recetasDB = [];
  let recetasFormulario = [];

  //Aca se guardan las recetas en la base de datos ingresadas en el formulario y se muestran en el index.ejs
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener las recetas del formulario" + err.message);
      return res.status(500).send("Error al obtener las recetas");
    } else {
      // Los resultados de la consulta se encuentran en results
      recetasFormulario = results;

      // Consulta para recetas ingresadas mediante el formulario
      connection.query(sqlDB, (err, resultDB) => {
        if(err) {
          console.error("Error al obtener las recetas de la base de datos: " + err.message);
          return res.status(500).send("Error al obtener las recetas");
        } else {
          recetasDB = resultDB;
          // Renderiza la página principal (index.ejs) y pasa las recetas
          res.render("index", { user: req.user, recetasDB, recetasFormulario, currentPage: req.path });
        }
      }); 
    }
  });
});


router.get("/login", (req, res) => {
  res.render("login", { alert: false });
});

router.get("/register", (req, res) => {
  res.render("register");
});

// Ruta para mostrar el formulario de agregar recetas
router.get("/agregar-recetas", authController.checkRole(["admin"]), (req, res) => {
  res.render("formRecetas");
});

router.get("/consejos-salud", authController.isAuthenticated, (req, res) => {
  res.render("consejosSalud", { user: req.user, currentPage: "consejos-salud" });
});

router.get("/alimentacion", authController.isAuthenticated, (req, res) => {
  res.render("alimentacion", { user: req.user, currentPage: "alimentacion" });
});

// Ruta para procesar el formulario y agregar la receta a la base de datos
router.post("/guardar-receta",authController.addReceta);

//router para los metodos del controller
router.get("/homePage", authController.homePage);
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);

// Ruta para eliminar recetas
router.get("/eliminar-receta/:id", authController.eliminarReceta);

module.exports = router;
