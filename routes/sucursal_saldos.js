/*
    Path: '/api/productos'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');

const { creaSucursalSaldos,
        consultaSucursalSaldos,
        consultaSucursalSaldoReposicion,
      } = require('../controllers/sucursal_saldos');

const router = Router();

router.put( '/crea_sucursal_saldos',
    check('id_sucursal', 'La sucursal es obligatorio.').not().isEmpty(),
    creaSucursalSaldos
);

router.get( '/consultasaldoreposicion/',
    validarJWT,
    consultaSucursalSaldoReposicion
);

router.get( '/sucursal_saldos/:id_sucursal',
    validarJWT,
    check('id_sucursal', 'La sucursal es obligatorio.').not().isEmpty(),
    consultaSucursalSaldos
);


module.exports = router;