/* 
    Logica que se ejecutara para la ruta que necesita realizar las funciones
    llamado Origen: /index
    Ruta:           /api/sucursales
    Controlador:    /routes/sucursales
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


// MOVIMIENTO DE LAS SUCURSALES
const creaSucursalMovimientos = async (req, res = response) => {
    try {
        const sucursalesObj = { 
            id_sucursal_movimiento: req.body.id_sucursal_movimiento,
            id_sucursal:            req.body.id_sucursal,
            id_sucursal_origen:     req.body.id_sucursal_origen,
            dc_tipo_movimiento:     req.body.dc_tipo_movimiento,
            dn_numero:              req.body.dn_numero,
            id_producto:            req.body.id_producto,
            dq_cantidad:            req.body.dq_cantidad,
            dc_usuario:             req.body.dc_usuario,
            dm_vigente:             req.body.dm_vigente
        };
        // Este sp ejecuta
        // 	CALL sp_p_crea_sucursal_saldos (in_id_sucursal);
	    //  CALL sp_p_crea_sucursal_saldos (in_id_sucursal_origen);
        const sql = `sp_p_crea_sucursal_movimientos @id_sucursal_movimiento, @id_sucursal, @id_sucursal_origen, @dc_tipo_movimiento, @dn_numero, @id_producto, @dq_cantidad, @dc_usuario, @dm_vigente`;
        
        console.log(sql);
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_sucursal_movimiento', type: 'int', value: sucursalesObj.id_sucursal_movimiento},
            {name: 'id_sucursal', type: 'int', value: sucursalesObj.id_sucursal},
            {name: 'id_sucursal_origen', type: 'int', value: sucursalesObj.id_sucursal_origen},
            {name: 'dc_tipo_movimiento', type: 'char', value: sucursalesObj.dc_tipo_movimiento},
            {name: 'dn_numero', type: 'int', value: sucursalesObj.dn_numero},
            {name: 'id_producto', type: 'int', value: sucursalesObj.id_producto},
            {name: 'dq_cantidad', type: 'money', value: sucursalesObj.dq_cantidad},
            {name: 'dc_usuario', type: 'char', value: sucursalesObj.dc_usuario},
            {name: 'dm_vigente', type: 'char', value: sucursalesObj.dm_vigente},
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

const consultaSucursalMovimientos = async(req, res = response) => {
    try {
        const { id_sucursal } = req.params
        const sql = `sp_c_sucursal_movimientos @id_sucursal`;

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
    creaSucursalMovimientos,
    consultaSucursalMovimientos,
}