/* 
    Logica que se ejecutara para la ruta que necesita realizar las funciones
    llamado Origen: /index
    Ruta:           /api/sucursal_saldos
    Controlador:    /routes/sucursal_saldos
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


// LECTURA DE SALDOS PARA LAS REPOSICIONES
const consultaSucursalSaldoReposicion = async(req, res = response) => {
    try {
        const reposicionObj = { 
            id_sucursal_origen:     req.query.id_sucursal_origen || 0,
            id_sucursal:            req.query.id_sucursal        || 0
        };
        //console.log('id_sucursal_origen', req.query);
        //console.log('id_sucursal_origen', reposicionObj.id_sucursal_origen, 'id_sucursal',reposicionObj.id_sucursal);

        var sql = `sp_c_sucursal_saldos_reposicion @id_sucursal_origen, @id_sucursal`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_sucursal_origen', type: 'int', value: reposicionObj.id_sucursal_origen},
            {name: 'id_sucursal', type: 'int', value: reposicionObj.id_sucursal},
            ]);

        var total = 0;
        var [registros] = resultado.data;
        total = registros.length
        //console.log('resultado', resultado);
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

// SALDOS DE LAS SUCURSALES
const creaSucursalSaldos = async (req, res = response) => {
    try {
        const id_sucursal = req.body.id_sucursal;
        var sql = `sp_p_crea_sucursal_saldos @id_sucursal`;
        //console.log(sql);
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_sucursal', type: 'int', value: id_sucursal},
            ]);
    
        var total = 0;
        var [registros] = resultado.data;
        total = registros.length
        //console.log('resultado', resultado);
        res.status(200).json({
            ok: true,
            totalRegistro: total,
            registro: registros,
        });   
    } catch (error) {
        //console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const consultaSucursalSaldos = async(req, res = response) => {
    try {
        const { id_sucursal } = req.params
        const sql = `sp_c_sucursal_saldos @id_sucursal`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_sucursal', type: 'int', value: id_sucursal},
            ]);
    
        var total = 0;
        var [registros] = resultado.data;
        total = registros.length
        //console.log('resultado', resultado);
        res.status(200).json({
            ok: true,
            totalRegistro: total,
            registro: registros,
        });   

        
    } catch (error) {
        //console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    consultaSucursalSaldoReposicion,
    creaSucursalSaldos,
    consultaSucursalSaldos
}