const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {

    // Leer el Token
    const token = req.header('x-token');
    
    //console.log('Token enviado',token);

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }


    try {
        const { dc_usuario } = jwt.verify( token, process.env.JWT_SECRET );
        //console.log( 'validarJWT', dc_usuario );

        req.dc_usuario = dc_usuario;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

}

module.exports = {
    validarJWT
}