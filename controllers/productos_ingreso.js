/* 
    Logica que se ejecutara para la ruta que necesita realizar las funciones
    llamado Origen: /index
    Ruta:           /api/productos_ingreso
    Controlador:    /routes/productos_ingreso
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




// PROCESOS DE INGRESOS
const creaIngresos = async (req, res = response) => {
    try {
        const ingresosObj = { 
            id_ingreso:             req.body.id_ingreso,
            id_proveedor:           req.body.id_proveedor,
            id_tipo_documento:      req.body.id_tipo_documento,
            id_tipo_ingreso:        req.body.id_tipo_ingreso,
            dg_ingreso:             req.body.dg_ingreso,
            id_sucursal:            req.body.id_sucursal,
            df_ingreso:             req.body.df_ingreso,
            dc_usuario:             req.body.dc_usuario,
            dm_vigente:             req.body.dm_vigente
        };
        
        var sql = `sp_p_crea_ingresos @id_ingreso, @id_proveedor, @id_tipo_documento, @id_tipo_ingreso, @dg_ingreso, @df_ingreso, @id_sucursal, @dc_usuario, @dm_vigente`;
        
        //const sql = `CALL sp_p_crea_sucursal_movimientos (?)`;
        console.log(sql);
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_ingreso', type: 'int', value: ingresosObj.id_ingreso},
            {name: 'id_proveedor', type: 'int', value: ingresosObj.id_proveedor},
            {name: 'id_tipo_documento', type: 'int', value: ingresosObj.id_tipo_documento},
            {name: 'id_tipo_ingreso', type: 'int', value: ingresosObj.id_tipo_ingreso},
            {name: 'dg_ingreso', type: 'varchar', value: ingresosObj.dg_ingreso},
            {name: 'id_sucursal', type: 'int', value: ingresosObj.id_sucursal},
            {name: 'df_ingreso', type: 'char', value: ingresosObj.df_ingreso},
            {name: 'dc_usuario', type: 'char', value: ingresosObj.dc_usuario},
            {name: 'dm_vigente', type: 'char', value: ingresosObj.dm_vigente},
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
             msg: 'Hable con el administrador',
             err: error
        })
    }
}

const creaIngresosDetalle = async (req, res = response) => {
    try {
        const ingresosObj = { 
            id_ingreso_detalle:     req.body.id_ingreso_detalle,
            id_ingreso:             req.body.id_ingreso,
            id_producto:            req.body.id_producto,
            dg_control_producto:    req.body.dg_control_producto,
            df_vencimiento:         req.body.df_vencimiento,
            dq_cantidad:            req.body.dq_cantidad,
            dq_precio:              req.body.dq_precio,
            dm_vigente:             req.body.dm_vigente
        };
        
        var sql = `sp_p_crea_ingresos_detalle @id_ingreso_detalle, @id_ingreso, @id_producto, @dg_control_producto, @df_vencimiento, @dq_cantidad, @dq_precio, @dm_vigente`;
        
        //const sql = `CALL sp_p_crea_sucursal_movimientos (?)`;
        console.log(sql);
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_ingreso_detalle', type: 'int', value: ingresosObj.id_ingreso_detalle},
            {name: 'id_ingreso', type: 'int', value: ingresosObj.id_ingreso},
            {name: 'id_producto', type: 'int', value: ingresosObj.id_producto},
            {name: 'dg_control_producto', type: 'varchar', value: ingresosObj.dg_control_producto},
            {name: 'df_vencimiento', type: 'char', value: ingresosObj.df_vencimiento},
            {name: 'dq_cantidad', type: 'money', value: ingresosObj.dq_cantidad},
            {name: 'dq_precio', type: 'money', value: ingresosObj.dq_precio},
            {name: 'dm_vigente', type: 'char', value: ingresosObj.dm_vigente},
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
             msg: 'Hable con el administrador',
             err: error
        })
    }
}

const consultaIngresos = async(req, res = response) => {
    try {
        const ingresosObj = { 
            dc_usuario:         req.query.dc_usuario || '',
            desde:              req.query.desde      || 0
        };
        var sql = `sp_c_ingresos  @dc_usuario, @desde`;
        //console.log(sql);
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'dc_usuario', type: 'char', value: ingresosObj.dc_usuario},
            {name: 'desde', type: 'int', value: ingresosObj.desde},
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

const consultaIngresosdetalle = async(req, res = response) => {
    try {
        const ingresosObj = { 
            id_ingreso:         req.query.id_ingreso || 0
        };
        var sql = `sp_c_ingresos_detalle  @id_ingreso`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_ingreso', type: 'int', value: ingresosObj.id_ingreso},
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

const buscaIngresos = async(req, res = response) => {
    try {
        const ingresosObj = { 
            id_ingreso:         req.query.id_ingreso || 0
        };
        const sql = `sp_b_ingresos @id_ingreso`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_ingreso', type: 'int', value: ingresosObj.id_ingreso},
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
    creaIngresos,
    creaIngresosDetalle,
    consultaIngresos,
    consultaIngresosdetalle,
    buscaIngresos,
}
