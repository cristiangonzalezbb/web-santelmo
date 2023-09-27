/*
    Path: '/api/control_stock
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');

const { 
        consultaSucursalStock,
        consultaSucursalStockReposicion,
      } = require('../controllers/control_stock');

const router = Router();

router.get( '/sucursal_stock/:dc_usuario',
    validarJWT,
    check('dc_usuario', 'El usuario es obligatorio.').not().isEmpty(),
    consultaSucursalStock
);

router.get( '/sucursal_stock_reposicion/:dc_usuario',
    validarJWT,
    check('dc_usuario', 'El usuario es obligatorio.').not().isEmpty(),
    consultaSucursalStockReposicion
);


module.exports = router;