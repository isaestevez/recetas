const express = require("express");
const dotenv = require("dotenv");
const cookieParse = require("cookie-parser");
const multer = require("multer");
const path = require("path");

const app = express();

//seteamos motor de plantillas
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");

//seteamos la carpeta public
app.use(express.static('public'));

//agregar imagenes para las recetas
//middlewares
const storage = multer.diskStorage({
    destination: path.join(__dirname, './public/img/img-form'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

app.use(multer({
    storage,
    dest: path.join(__dirname, './public/img/img-form')
}).single('imagen')) //aca viene del formulario del name: imagen

//configurar nodejs, para procesar datos enviados desde forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//seteamos las variables de entorno
dotenv.config({path: "./.env"});

//para poder trabajar con las cookies
app.use(cookieParse());

//llamar a router
app.use("/", require("./router/router.js"));

//para eliminar el cache y que  no se pueda volver con el boton de back luego de que hacemos un LOGOUT
app.use(function(req, res, next) {
    if (!req.user) {
        res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    }
    next(); 
});
    

app.listen(3000, () => {
    console.log('Server Running on Port 3000')
});

