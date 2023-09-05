const express = require("express");
const router = express.Router();
// Importar el controlador y multer
const authController = require("../controllers/authController.js");
const connection = require("../database/db.js");
const upload = require('../controllers/authController').upload;

//router para las vistas
router.get("/", authController.isAuthenticated, (req, res) => {
    //Consulta SQL para obtener todas las recetas
    const sql = "SELECT * FROM recetas";

    connection.query(sql, (err, results) => {
        if(err) {
            console.error("Error al obtener las recetas" + err.message);
            return res.status(500).send("|Error al obtener las recetas");
        } else {
            //Los resultados de la consulta se encuentran en results
            const recetas = results;

            //Renderiza la pagina index.ejs y pasa las recetas
            res.render("index", {user:req.user, recetas:recetas});
        }
    });
});

router.get("/login", (req, res) => {
    res.render("login", {alert:false})
});

router.get("/register", (req, res) => {
    res.render("register")
});

// Ruta para mostrar el formulario de agregar recetas
router.get("/agregar-recetas", (req, res) => {
    res.render("formRecetas")
});


// Ruta para procesar el formulario y agregar la receta a la base de datos
router.post("/formRecetas", upload.single('imagen'), authController.addReceta);
//router para los metodos del controller
router.get("/homePage", authController.homePage)
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);


module.exports = router;


