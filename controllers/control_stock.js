/* 
    Logica que se ejecutara para la ruta que necesita realizar las funciones
    llamado Origen: /index
    Ruta:           /api/control_stock
    Controlador:    /routes/control_stock
*/
const { request, response } = require('express');
const conectarSqlServer = new(require('rest-mssql-nodejs')) ({
    user     : process.env.SQLSERVERUSER,
    server   : 'mssql-132344-0.cloudclusters.net',
    port     : 19118,
    password : process.env.SQLSERVERPASSWORD,
    database : process.env.SQLSERVERDATABASE,
    options: {
        encrypt  : true, //for Azure
        trustServerCertificate: true, // Cambiar a true para local dev / self-signer certs
        enableArithAbort: false
    }
});



// LECTURA DE LA SUCURSAL PARA PODER INGRESAR A LOS DETALLES DE STOCK Y CONSIGNACION
const consultaSucursalStock = async(req, res = response) => {
    try {
        const { dc_usuario } = req.params
        const sql = `sp_c_revision_stock  @dc_usuario`;
        var resultado = await conectarSqlServer.executeQuery(sql, [{
            name: 'dc_usuario', type: 'char', value: dc_usuario
        }])

        //Transforma el objeto y extrae el total de registros
        //<Begin>
        var total = 0;
        var [registros] = resultado.data;
        total = Object.length
        //<End>

        res.status(200).json({
            ok: true,
            totalRegistro: total,
            registro: registros,
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const consultaSucursalStockReposicion = async(req, res = response) => {
    try {
        const { dc_usuario } = req.params
        const sql = `sp_c_revision_stock_reposicion @dc_usuario`;
        console.log(sql);
        var resultado = await conectarSqlServer.executeQuery(sql, [{
            name: 'dc_usuario', type: 'char', value: dc_usuario
        }])

        //Transforma el objeto y extrae el total de registros
        //<Begin>
        var total = 0;
        var [registros] = resultado.data;
        total = Object.length
        //<End>

        res.status(200).json({
            ok: true,
            totalRegistro: total,
            registro: registros,
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

// LECTURA DE SALDOS PARA LAS REPOSICIONES
const consultaSucursalSaldoReposicion = async(req, res = response) => {
    try {
        const reposicionObj = { 
            id_sucursal_origen:     req.query.id_sucursal_origen || 0,
            id_sucursal:            req.query.id_sucursal        || 0
        };
        const sql = `sp_c_sucursal_saldos_reposicion @id_sucursal_origen, @id_sucursal`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_sucursal_origen', type: 'int', value: id_sucursal_origen},
            {name: 'id_sucursal', type: 'int', value: id_sucursal}
        ])

        //Transforma el objeto y extrae el total de registros
        //<Begin>
        var total = 0;
        var [registros] = resultado.data;
        total = Object.length
        //<End>

        res.status(200).json({
            ok: true,
            totalRegistro: total,
            registro: registros,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    consultaSucursalStock,
    consultaSucursalStockReposicion,
}