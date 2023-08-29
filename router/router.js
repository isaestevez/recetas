const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");

//router para las vistas
router.get("/", authController.isAuthenticated, (req, res) => {
    res.render("index")
});

router.get("/login", (req, res) => {
    res.render("login")
});

router.get("/register", (req, res) => {
    res.render("register")
});

//router para los metodos del controller
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);


module.exports = router;

