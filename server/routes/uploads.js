const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options middleware
app.use(fileUpload({ useTempFiles: true }));


app.put('/upload/:tipo/:id', function(req, res) {


    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No hay archivos.'
            }
        });
    }
    //validacion de tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipos permitidos son ' + tiposValidos.join(', ')
            }
        });
    }


    let archivo = req.files.archivo;

    let nombreArchivo = archivo.name.split('.');

    let extension = nombreArchivo[nombreArchivo.length - 1];


    //extensiones permitidas 
    let extensionesValidas = ['png', 'jpg', 'git', 'jpeg'];


    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
            }
        });
    }

    //cambiar nombre de archivo
    let nuevoNombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //aqui es donde se guarda la imagen
    archivo.mv(`uploads/${ tipo }/${ nuevoNombreArchivo }`, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (tipo == 'usuarios') {
            imagenUsuario(id, res, nuevoNombreArchivo);
        } else {
            imagenProducto(id, res, nuevoNombreArchivo);
        }


    });

});

//ocupo recibir el objeto res para poder trabajarlo en la funcion
function imagenUsuario(id, res, nuevoNombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nuevoNombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nuevoNombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');


        usuarioDB.img = nuevoNombreArchivo;

        usuarioDB.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nuevoNombreArchivo
            })
        })

    })
}

function imagenProducto(id, res, nuevoNombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nuevoNombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nuevoNombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');


        productoDB.img = nuevoNombreArchivo;

        productoDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nuevoNombreArchivo
            })
        })

    })
}


function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        //borra el path
        fs.unlinkSync(pathImagen);
    }


}

module.exports = app;