const mysql = require("mysql");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err) => {
    if(err) {
        console.error('Error al conectar a la base de datos: ' + err.stack);
        return
    }
    console.log('Conexión exitosa a la base de datos');
});

module.exports = connection;