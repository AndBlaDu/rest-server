const jwt = require('jsonwebtoken');

//VERIFICAR TOKEN
//next continua con la ejecution del programa o peticion 
let verificarToken = (req, res, next) => {

    let token = req.get('token');

    //Con este metodo se valida el token 
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });

};


let verificarRol = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador.'
            }
        });
    }

};


module.exports = {
    verificarToken,
    verificarRol
}