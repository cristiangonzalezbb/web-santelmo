/*
    Path: '/api/productos'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getProductos,
        getProductosByCodigo,
        crearActualizaProducto,
        getProductosByTexto
      } = require('../controllers/productos');

const router = Router();

// La primera es la ruta de getMedicos.
// La segunda es el controlador, no lo ejecuta solo envia la referencia, porque no tiene el ()
router.get( '/buscar', validarJWT, getProductos );
router.get( '/buscar_producto/:id_producto',
    validarJWT, 
    check('id_producto', 'El codigo de producto es necesario para la busqueda.').not().isEmpty(),
    getProductosByCodigo
);
router.get( '/buscar_producto_texto/:texto',
    validarJWT, 
    getProductosByTexto
);
router.post( '/actualizainserta/',
    validarJWT,
    check('dc_producto', 'El codigo de producto es obligatorio.').not().isEmpty(),
    check('dg_descripcion', 'La descripcion es obligatorio.').not().isEmpty(),
    check('id_tipo', 'El tipo es obligatorio.').not().isEmpty(),
    check('id_categoria', 'La categoria es obligatorio.').not().isEmpty(),
    check('dq_precio', 'El precio es obligatorio.').not().isEmpty(),
    check('dc_usuario', 'El usuario es obligatorio.').not().isEmpty(),
    check('dc_vigente', 'El estado de vigencia es obligatorio.').not().isEmpty(),
    crearActualizaProducto
);

module.exports = router;