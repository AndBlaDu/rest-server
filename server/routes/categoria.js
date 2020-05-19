const express = require('express');
const Categoria = require('../models/categoria');

let { verificarToken, verificarRol } = require('../middlewares/autenticacion')
let app = express();



//todas
app.get('/categoria', (req, res) => {

    //filtrando cuales campos quiere que se regresen
    Categoria.find().populate('usuario', 'nombre email').sort('descripcion').exec((err, categorias) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        });
    });

});

//detalle
app.get('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    // let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    }).populate('usuario', 'nombre email');
});


//crear
app.post('/categoria', verificarToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

//editar
app.put('/categoria/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let categoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, categoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

//delete
app.delete('/categoria/:id', [verificarToken, verificarRol], (req, res) => {

    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }


        res.json({
            ok: true,
            categoria: categoriaBorrada,
            message: 'Borrado correctamente'
        });
    });
});


module.exports = app;