/* 
    Logica que se ejecutara para la ruta que necesita realizar las funciones
    llamado Origen: /index
    Ruta:           /api/asigna_sucursal
    Controlador:    /routes/asigna_sucursal
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


//Asignación de Sucursales
const consultaAsignarSucursal = async(req, res = response) => {
    try {
        const asignasucursalObj = { 
            dc_usuario:     req.query.dc_usuario || '',
            desde:          Number(req.query.desde) || 0
        };
        
        //console.log('usuario', asignasucursalObj.dc_usuario, 'Desde', asignasucursalObj.desde);
        const sql = `sp_c_asigna_sucursal @dc_usuario, @desde`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'dc_usuario', type: 'char', value : asignasucursalObj.dc_usuario},
            {name: 'desde', type: 'int', value : asignasucursalObj.desde}
        ])

        var total = 0;
        var [registros] = resultado.data;
        total = registros.length
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

const buscarAsignarSucursal = async(req, res = response) => {
    try {
        const asignasucursalObj = { 
            id_asigna_sucursal:     req.query.id_asigna_sucursal || 0
        };
        
        //console.log('usuario', asignasucursalObj.dc_usuario, 'Desde', asignasucursalObj.desde);
        const sql = `sp_b_asigna_sucursal @id_asigna_sucursal`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_asigna_sucursal', type: 'char', value : asignasucursalObj.id_asigna_sucursal},
        ])

        var total = 0;
        var [registros] = resultado.data;
        total = registros.length
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

const buscarAsignarSucursalPropia = async(req, res = response) => {
    try {
        const asignasucursalObj = { 
            dc_usuario:     req.query.dc_usuario || ''
        };
        const sql = `sp_b_asigna_sucursal_propio @dc_usuario`;
        //console.log(sql);
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'dc_usuario', type: 'char', value : asignasucursalObj.dc_usuario},
        ])

        var total = 0;
        var [registros] = resultado.data;
        total = registros.length
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

const creaCreaAsignaSucursal = async (req, res = response) => {
    try {
        const asignasucursalObj = { 
            id_asigna_sucursal: req.body.id_asigna_sucursal,
            dc_usuario:         req.body.dc_usuario,
            id_sucursal:        req.body.id_sucursal,
            dm_propio:          req.body.dm_propio,
            dm_vigente:         req.body.dm_vigente
        };
        
        const sql = `sp_p_crea_asigna_sucursal @id_asigna_sucursal, @dc_usuario, @id_sucursal, @dm_propio, @dm_vigente`;
        
        //const sql = `CALL sp_p_crea_sucursal_movimientos (?)`;
        //console.log(sql);
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_asigna_sucursal', type: 'int', value : asignasucursalObj.id_asigna_sucursal},
            {name: 'dc_usuario', type: 'char', value : asignasucursalObj.dc_usuario},
            {name: 'id_sucursal', type: 'int', value : asignasucursalObj.id_sucursal},
            {name: 'dm_propio', type: 'char', value : asignasucursalObj.dm_propio},
            {name: 'dm_vigente', type: 'char', value : asignasucursalObj.dm_vigente},
        ])

        var total = 0;
        var [registros] = resultado.data;
        total = registros.length
        res.status(200).json({
            ok: true,
            totalRegistro: total,
            registro: registros,
        });
        
    } catch (error) {
        //console.log(error);
        res.status(400).json({
             ok: false,
             msg: 'Hable con el administrador',
             err: error
        })
    }
}


module.exports = {
    creaCreaAsignaSucursal,
    consultaAsignarSucursal,
    buscarAsignarSucursal,
    buscarAsignarSucursalPropia,
}
