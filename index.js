//Para revisar todas las variables
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser'); 
const path = require('path');
//Acepta cualquier dominio
const cors = require('cors');

//Importo la configuración de la conexion desde database/config.json
//El cual se conecta a MySql
const { dbConnectionSqlServer } =  require('./database/configsqlserver');

const PORT = process.env.PORT || 3050;

//Inicializo Express
const app = express();

app.use(express.static('public'));

//Configurar CORS - Son middleweare
app.use(cors());

//Para revisar todas las variables de entorno creadas y que usa la aplicacion
//console.log(process.env);

app.use(bodyParser.json());

// Base de datos
//Esto esta en database/config.js
dbConnectionSqlServer();

//Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Conectado a mySql'
    })
})

app.use( '/api/usuarios',   require('./routes/usuarios') );
app.use( '/api/productos',   require('./routes/productos') );
app.use( '/api/sucursales',   require('./routes/sucursales') );
app.use( '/api/todo',   require('./routes/busquedas') );
app.use( '/api/tablas',   require('./routes/tablas') );
app.use( '/api/upload',   require('./routes/uploads') );

app.use( '/api/asigna_sucursal',   require('./routes/asigna_sucursal') );
app.use( '/api/control_stock',   require('./routes/control_stock') );
app.use( '/api/productos_ingreso',   require('./routes/productos_ingreso') );
app.use( '/api/sucursal_movimientos',   require('./routes/sucursal_movimientos') );
app.use( '/api/sucursal_saldos',   require('./routes/sucursal_saldos') );

app.get('*', (req, res) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html'));
})
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
