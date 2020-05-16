//Este archivo de configuracion al cargarse primero se ejecuta todo lo que contenga
require("./config/config");

// Using Node.js `require()`
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const bodyParser = require("body-parser");


//Middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));



mongoose.connect(
    process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    (err, res) => {
        if (err) throw err;
        console.log("Base de datos conectada");
    }
);

app.listen(process.env.PORT, () => {
    console.log("Escuchando en puerto: ", process.env.PORT);
});