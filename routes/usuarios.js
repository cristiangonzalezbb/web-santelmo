/*
    Path: '/api/usuarios'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getUsuarios,
        getUsuariosByCodigo, 
        getUsuariosIngreso,
        crearUsuario,
        actualizaUsuario,
        renewToken
      } = require('../controllers/usuarios');

const router = Router();

// La primera es la ruta de getMedicos.
// La segunda es el controlador, no lo ejecuta solo envia la referencia, porque no tiene el ()
router.get( '/buscar', validarJWT, getUsuarios );

router.get( '/buscar_usuario/:dc_usuario',
    validarJWT,
    check('dc_usuario', 'El usuario de necesario para la busqueda.').not().isEmpty(),
    getUsuariosByCodigo
);

router.post( '/login',
    check('dc_usuario', 'El usuario es obligatorio.').not().isEmpty(),
    check('dg_password', 'La Password es obligatorio.').not().isEmpty(),
    getUsuariosIngreso
);

router.post( '/insert/',
    check('dc_usuario', 'El usuario es obligatorio.').not().isEmpty(),
    check('dg_mail', 'El mail es obligatorio.').not().isEmpty(),
    check('dg_nombre', 'El Nombre es obligatorio.').not().isEmpty(),
    check('dg_password', 'La Password es obligatorio.').not().isEmpty(),
    check('dn_perfil_usuario', 'El tipo de perfil es obligatorio.').not().isEmpty(),
    check('dm_admin', 'El estado de vigencia es obligatorio.').not().isEmpty(),
    crearUsuario
);

router.put( '/update/:dc_usuario',
    validarJWT,
    check('dg_mail', 'El mail es obligatorio.').not().isEmpty(),
    check('dg_nombre', 'El Nombre es obligatorio.').not().isEmpty(),
    check('dg_password', 'La Password es obligatorio.').not().isEmpty(),
    check('dn_perfil_usuario', 'El tipo de perfil es obligatorio.').not().isEmpty(),
    check('dm_admin', 'El estado de vigencia es obligatorio.').not().isEmpty(),
    actualizaUsuario
);

router.get( '/renew',
    validarJWT,
    renewToken
)

module.exports = router;