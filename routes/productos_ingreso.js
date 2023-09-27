/*
    Path: '/api/productos_ingreso
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');

const { creaIngresos,
        creaIngresosDetalle,
        // creaCreaProductoSaldo,
        consultaIngresos,
        consultaIngresosdetalle,
        buscaIngresos,
        // actualizaIngresoMovimiento
      } = require('../controllers/productos_ingreso');

const router = Router();

// PROCESOS DE INGRESOS
router.put( '/crea_ingresos',
    check('id_sucursal', 'Debe indicar la sucursal.').not().isEmpty(),
    check('id_tipo_documento', 'Debe indicar el tipo de documento.').not().isEmpty(),
    check('id_tipo_ingreso', 'Debe indicar el tipo de ingreso.').not().isEmpty(),
    check('dn_ingreso', 'Debe indicar el numero de documento.').not().isEmpty(),
    check('df_ingreso', 'Debe indicar la fecha de ingreso.').not().isEmpty(),
    creaIngresos
);

router.put( '/crea_ingresos_detalle',
    check('id_ingreso', 'Debe indicar el numero de ingreso.').not().isEmpty(),
    check('id_producto', 'Debe indicar el producto.').not().isEmpty(),
    check('df_vencimiento', 'Debe indicar la fecha de vencimiento del producto.').not().isEmpty(),
    check('dq_cantidad', 'Debe indicar la cantidad del producto.').not().isEmpty(),
    check('dq_precio', 'Debe indicar el precio del producto.').not().isEmpty(),
    creaIngresosDetalle
);

// router.get( '/crea_producto_saldo',
//     creaCreaProductoSaldo
// );

router.get( '/consultaingresos/',
    validarJWT,
    consultaIngresos
);

router.get( '/consultaingresosdetalle/',
    validarJWT,
    consultaIngresosdetalle
);

router.get( '/buscaingresos/',
    validarJWT,
    buscaIngresos
);

// router.get( '/actualizaingresomovimiento/',
//     validarJWT,
//     actualizaIngresoMovimiento
// );

module.exports = router;