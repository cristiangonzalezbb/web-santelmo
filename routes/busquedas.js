/*
    Path: '/api/todo:busqueda'
*/

const { Router } = require( 'express' );
const router = Router();
const { validarJWT } = require('../middlewares/validar-jwt');

const { getTodo, getDocumentosColeccion } = require('../controllers/busqueda');


router.get( '/:busqueda', validarJWT, getTodo );
router.get( '/coleccion/:tabla/:busqueda', validarJWT, getDocumentosColeccion );

module.exports = router;
