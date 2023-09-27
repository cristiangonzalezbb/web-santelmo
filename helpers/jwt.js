const jwt = require('jsonwebtoken');

const generarJWT = (dc_usuario) => {

    return new Promise( (resolve, reject) => {
        
        const payload = {
            dc_usuario,
        };
    
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '72h'
        }, (err, token) => {
            if ( err ) {
                console.log(err);
                reject('No se pudo generar el JTM');
            } else {
                resolve( token );
            }
        });
    });

}

module.exports = {
    generarJWT
}