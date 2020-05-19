const express = require('express');
const { verificarToken } = require('../middlewares/autenticacion');

const app = express();
const Producto = require('../models/producto');


app.get('/productos', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 0;

    desde = Number(desde);
    limite = Number(limite);

    //filtrando cuales campos quiere que se regresen
    Producto.find({ disponible: true }).populate('usuario', 'nombre email').populate('categoria', 'descripcion').skip(desde).limit(limite).exec((err, productos) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Producto.countDocuments({ disponible: true }, (err, registros) => {
            res.json({
                ok: true,
                cantidad: registros,
                productos
            });
        })


    });

});


app.get('/productos/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    // let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    }).populate('categoria', 'descripcion').populate('usuario', 'nombre email');

});

app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;

    //i obvia mayusculas y minusculas
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex }).populate('categoria', 'descripcion').populate('usuario', 'nombre email').exec((err, productos) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        });
    });

});

app.post('/productos', verificarToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });


    producto.save((err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

app.put('/productos/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let producto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    };

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            producto: productoDB
        });

    });
});

app.delete('/productos/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    let producto = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            producto: productoDB
        });

    });
});


module.exports = app;