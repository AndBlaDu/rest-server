const express = require('express');
const fs = require('fs');

const path = require('path');

const { verificarTokenImg } = require('../middlewares/autenticacion')

let app = express();


app.get('/imagen/:tipo/:img', verificarTokenImg, (req, res) => {


    let tipo = req.params.tipo;
    let img = req.params.img;


    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        //lee el content type del archivo, si es img regres img, si es pdf regresa pdf
        res.sendFile(pathImagen);
    } else {
        let noImg = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(noImg);
    }



});


module.exports = app;