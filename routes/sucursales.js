/*
    Path: '/api/productos'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getSucursales,
        getSucursalesByCodigo,
        crearActualizaSucursales,
        getSucursalesSinProveedor,
        getSucursalesConProveedor
      } = require('../controllers/sucursales');

const router = Router();

// La primera es la ruta de getMedicos.
// La segunda es el controlador, no lo ejecuta solo envia la referencia, porque no tiene el ()
router.get( '/consulta', validarJWT, getSucursales );

router.get( '/buscar_sucursal/:id_sucursal',
    validarJWT,
    check('id_sucursal', 'El codigo de sucursal es necesario para la busqueda.').not().isEmpty(),
    getSucursalesByCodigo
);

router.post( '/actualizainserta/',
    validarJWT,
    check('id_sucursal', 'El codigo de sucursal es obligatorio.').not().isEmpty(),
    check('dg_descripcion', 'La descripcion es obligatorio.').not().isEmpty(),
    check('dg_direccion', 'La direccion es obligatorio.').not().isEmpty(),
    check('dg_contacto', 'El contacto es obligatorio.').not().isEmpty(),
    check('dg_telefono', 'El telefono es obligatorio.').not().isEmpty(),
    check('dg_mail', 'El mail es obligatorio.').not().isEmail(),
    check('dc_usuario', 'El usuario es obligatorio.').not().isEmpty(),
    check('dm_vigente', 'El estado de vigencia es obligatorio.').not().isEmpty(),
    crearActualizaSucursales
);

router.get( '/consultasinproveedor', validarJWT, getSucursalesSinProveedor );
router.get( '/consultaconproveedor', validarJWT, getSucursalesConProveedor );
module.exports = router;