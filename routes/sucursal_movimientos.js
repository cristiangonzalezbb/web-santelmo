/*
    Path: '/api/sucursal_movimientos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');

const { creaSucursalMovimientos,
        consultaSucursalMovimientos,
      } = require('../controllers/sucursal_movimientos');

const router = Router();

router.put( '/crea_sucursal_movimientos', 
    validarJWT,
    check('id_sucursal_movimiento', 'El codigo del movimiento es obligatorio.').not().isEmpty(),
    check('id_sucursal', 'La sucursal es obligatorio.').not().isEmpty(),
    check('id_sucursal_origen', 'La sucursal de origen es obligatorio.').not().isEmpty(),
    check('dc_tipo_movimiento', 'El tipo de movimiento es obligatorio.').not().isEmpty(),
    check('dn_numero', 'El numero de operacion es obligatorio.').not().isEmpty(),
    check('id_producto', 'El producto es obligatorio.').not().isEmail(),
    check('dq_cantidad', 'La cantidad es obligatorio.').not().isEmpty(),
    check('dq_precio', 'El precio es obligatorio.').not().isEmpty(),
    check('dc_usuario', 'El usuario es obligatorio.').not().isEmpty(),
    check('dc_vigente', 'El estado de vigencia es obligatorio.').not().isEmpty(),
    creaSucursalMovimientos
);

router.get( '/sucursal_movimientos/:id_sucursal',
    validarJWT,
    check('id_sucursal', 'La sucursal es obligatorio.').not().isEmpty(),
    consultaSucursalMovimientos
);

module.exports = router;