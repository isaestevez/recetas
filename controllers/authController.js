//Aca vamos a crear los procedimientos para controlar toda nuestra logica en cuanto a la registracion, el login, la autenticacion
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const connection = require("../database/db.js");
//llamar a promisify(promisifai) que esta incluido por nodejs, indica que vamos a utilizar promesas,
//vamos a utilizar una comunicacion asyncrona, es algo que la funcion nos va a devolver, si tenemos una promesa que
//nos devuelva, retornara, puede ser favorable, o que no funcione correctamente, reject
const { promisify } = require("util");

exports.homePage = (req, res) => {
  if (!req.user) {
    res.render("homePage", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
};

//procedimiento para registrarnos
exports.register = async (req, res) => {
  try {
    const name = req.body.name;
    const user = req.body.user;
    //esta es la password que ingresado de texto plano, abajo en passwordHaash lo capturamos y la encriptamos
    const pass = req.body.pass;

    //aca tenemos que guardar la contraseña encriptada
    const passHash = await bcryptjs.hash(pass, 8); //8 de iteracion
    //aqui hacemos la consulta a la base de datos para capturar la data ingresada
    connection.query(
      "INSERT INTO users SET ?",
      { user: user, name: name, pass: passHash },
      (error, results) => {
        if (error) {
          console.log(error);
          alert("El usuario ya existe");
        } else {
          // valores que recibe la plantilla register mediante un objecto
          res.render("register", {
            alert: true,
            alertTitle: "Registration",
            alertMessage: "¡Successful Registration!",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "login",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    const user = req.body.user;
    const pass = req.body.pass;
    // console.log(user + " - " + pass)
    if (!user || !pass) {
      res.render("login", {
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese un usuario y password",
        alertIcon: "info",
        showConfirmButton: true,
        timer: false,
        ruta: "login",
      });
    } else {
      connection.query(
        "SELECT * FROM users WHERE user = ?",
        [user],
        async (error, results) => {
          //preguntamos si el usuario esta vacio? o no encontramos la password -> (await bcryptjs.compare(pass, results[0].pass)) ->
          // esta en la documentacion: npmjs.com/package/bcryptjs
          if (
            user.length === 0 ||
            !results[0] ||
            !(await bcryptjs.compare(pass, results[0].pass))
          ) {
            res.render("login", {
              alert: true,
              alertTitle: "Error",
              alertMessage: "Usuario y/o Contraseña Incorrectas",
              alertIcon: "error",
              showConfirmButton: true,
              timer: false,
              ruta: "login",
            });
          } else {
            // Verifica si el usuario es administrador (suponiendo que el ID de administrador es 1)
            // if (results[0].rol_id === 1) {
            //   // Si es administrador, establece una variable de sesión o cookie para identificarlo como administrador
            //   req.session.isAdmin = true; // Esto es solo un ejemplo, puedes ajustarlo a tu sistema de manejo de sesiones
            // }
            //Inicio de sesion OK, generar el jwt -> documentacion: npmjs.com/package/jsonwebtoken
            const id = results[0].id;
            const rol = results[0].rol;
            const token = jwt.sign(
              { id: id, rol: rol },
              process.env.JWT_SECRETO,
              {
                expiresIn: process.env.JWT_TIEMPO_EXPIRA,
              }
            );
            //generamos token SIN fecha de expiracion
            //const token = jwt.sign({id:id}, process.env.JWT_SECRETO)
            console.log("TOKEN: " + token + " para el USUARIO: " + user);
            //configurar las cookies
            const cookiesOptions = {
              expires: new Date(
                Date.now() +
                  process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 +
                  1000
              ),
              httpOnly: true,
            };
            res.cookie("jwt", token, cookiesOptions);
            //Cartel de Login Correcto
            res.render("login", {
              alert: true,
              alertTitle: "Conexión exitosa",
              alertMessage: "¡Login Correcto!",
              alertIcon: "success",
              showConfirmButton: false,
              timer: 1500,
              ruta: "", //vacio porque despues va a redirigir a la pagina principal
            });
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

exports.isAuthenticated = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodificada = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRETO
      );
      //chequear para ver si el usuario esta en la db
      connection.query(
        "SELECT * FROM users WHERE id = ?",
        [decodificada.id],
        (error, results) => {
          //el next() esta explicado en la documentacion, es un middleware: expressjs.com
          if (!results) {
            return next();
          }
          req.user = results[0];
          return next();
        }
      );
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    //si no esta autenticado, redirige al login
    res.redirect("/homePage");
  }
};

// Es para saber si el rol es admin o usuario
exports.checkRole = (roles) => async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodificada = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRETO
      );
      // Ahora, puedes acceder al rol del usuario desde el token decodificado
      const rolUsuario = decodificada.rol;

      // Verifica si el usuario tiene el rol necesario
      if (!roles.includes(rolUsuario)) {
        return res
          .status(403)
          .send("No tienes permiso para acceder a esta página.");
      } else {
        // Si el usuario tiene el rol necesario, permite el acceso
        next();
      }
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    // Si no se encuentra el token en las cookies, redirige al login
    res.redirect("/login");
  }
};

exports.addReceta = (req, res) => {
  console.log(req.body);
  try {
    const { nombre, tipo_receta, ingredientes, instrucciones, tiempo_coccion, dificultad_receta } = req.body;
    const imagen = req.file.filename; // Nombre de la imagen subida

    // Inserta la receta en la base de datos
    connection.query(
      "INSERT INTO recetas (nombre, tipo_receta, dificultad_receta, tiempo_coccion, ingredientes, instrucciones, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nombre, tipo_receta, dificultad_receta, tiempo_coccion, ingredientes, instrucciones, imagen],
      (err, result) => {
        if (err) {
          console.log("Error al guardar la receta: " + err.message);
          res.status(500).send("Error al guardar la receta.");
        } else {
          console.log("Receta guardada con éxito");
          // valores que recibe la plantilla formulario mediante un objecto
          res.render("formRecetas", {
            alert: true,
            alertTitle: "Saved Recipe",
            alertMessage: "¡Recipe saved Successfully!",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.eliminarReceta = (req, res) => {
  const recetaId = req.params.id; // el ID de la receta se pasa como parámetro en la URL

  // Verifica si la receta se encuentra en la tabla recetas (ingresadas desde el formulario) o recetas_base_datos (base de datos)
  const tabla = req.query.tabla; // se pasa el nombre de la tabla como un parámetro en la URL

  // Define la consulta SQL para eliminar la receta según la tabla especificada
  let sql;
  if (tabla === "recetas") {
    sql = "DELETE FROM recetas WHERE idRecetas = ?";
  } else if (tabla === "recetas_base_datos") {
    sql = "DELETE FROM recetas_base_datos WHERE idDB = ?";
  }

  // Ejecuta la consulta SQL correspondiente
  connection.query(sql, [recetaId], (err, result) => {
    if (err) {
      console.log("Error al eliminar la receta: " + err.message);
      res.status(500).send("Error al eliminar la receta.");
    } else {
      console.log("Receta eliminada con éxito");
      // Redirige a la página principal o a donde desees después de eliminar la receta
      res.redirect("/");
    }
  });
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  return res.redirect("/login");
};
