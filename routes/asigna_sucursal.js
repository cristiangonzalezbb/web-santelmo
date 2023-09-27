/*
    Path: '/api/asigna_sucursal'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');

const { consultaAsignarSucursal,
        buscarAsignarSucursal,
        buscarAsignarSucursalPropia,
        creaCreaAsignaSucursal,
      } = require('../controllers/asigna_sucursal');

const router = Router();



router.get( '/consultaasignasucursal/',
    validarJWT,
    // check('dc_usuario', 'El codigo de usuario es necesario para la busqueda.').not().isEmpty(),
    consultaAsignarSucursal
);

router.get( '/buscaasignasucursal/',
    // validarJWT,
    buscarAsignarSucursal
);

router.get( '/buscaasignasucursalpropio/',
    // validarJWT,
    buscarAsignarSucursalPropia
);

router.put( '/creaasignasucursal',
    check('dc_usuario', 'El usuario es obligatorio.').not().isEmpty(),
    check('id_sucursal', 'La sucursal es obligatorio.').not().isEmpty(),
    creaCreaAsignaSucursal
);

module.exports = router;