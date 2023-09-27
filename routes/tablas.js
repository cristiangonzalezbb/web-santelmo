/*
    Path: '/api/tablas'
*/
const { Router } = require('express');

const { getTipo,
        getCategoria,
        getTipoDocumento,
        getTipoIngreso
      } = require('../controllers/tablas');

const router = Router();

// La primera es la ruta de getMedicos.
// La segunda es el controlador, no lo ejecuta solo envia la referencia, porque no tiene el ()
router.get( '/tipo', getTipo );
router.get( '/categoria', getCategoria);
router.get( '/tipodocumento', getTipoDocumento);
router.get( '/tipoingreso', getTipoIngreso);
module.exports = router;