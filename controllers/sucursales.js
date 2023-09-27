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


//BUSCA TODAS LAS SUCURSALES ASOCIADAS
const getSucursales = async(req, res = response) => {
    //Sql
    try {
        const desde = Number(req.query.desde) || 0;

        var sql = `SELECT * FROM tb_sucursales where dm_vigente = 'S'`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
        ])

        var total = 0;
        var [registros] = resultado.data;
        total = registros.length
        
    
        //console.log('Total Registro', total);
        var sql = `SELECT top 10 * FROM tb_sucursales WHERE dm_vigente = 'S'`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
        ])

        var [registros] = resultado.data;
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

const getSucursalesByCodigo = async(req, res = response) => {
    try {
        const { id_sucursal } = req.params
        const sql = `select * from tb_sucursales where id_sucursal = @id_sucursal  and dm_vigente = 'S'`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_sucursal', type: 'int', value: id_sucursal},
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

const crearActualizaSucursales = async (req, res = response) => {
    try {
        const sucursalesObj = { 
            id_sucursal:        req.body.id_sucursal,
            dc_rut:             req.body.dc_rut,
            dg_descripcion:     req.body.dg_descripcion,
            dg_direccion:       req.body.dg_direccion,
            dg_contacto:        req.body.dg_contacto,
            dg_telefono:        req.body.dg_telefono,
            dg_mail:            req.body.dg_mail,
            dc_usuario:         req.body.dc_usuario,
            df_creacion:        req.body.df_creacion,
            dm_proveedor:       req.body.dm_proveedor,
            dm_vigente:         req.body.dm_vigente
        };
       
        //console.log('Paso a ejecutar el insert');
        const sql = `sp_p_crea_sucursal @id_sucursal, @dc_rut, @dg_descripcion, @dg_direccion, @dg_contacto, @dg_telefono, @dg_mail, @dc_usuario, @dm_proveedor, @dm_vigente`;
        //console.log('Antes del Insert');
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_sucursal', type: 'int', value: sucursalesObj.id_sucursal},
            {name: 'dc_rut', type: 'char', value: sucursalesObj.dc_rut},
            {name: 'dg_descripcion', type: 'varchar', value: sucursalesObj.dg_descripcion},
            {name: 'dg_direccion', type: 'varchar', value: sucursalesObj.dg_direccion},
            {name: 'dg_contacto', type: 'varchar', value: sucursalesObj.dg_contacto},
            {name: 'dg_telefono', type: 'char', value: sucursalesObj.dg_telefono},
            {name: 'dg_mail', type: 'varchar', value: sucursalesObj.dg_mail},
            {name: 'dc_usuario', type: 'char', value: sucursalesObj.dc_usuario},
            {name: 'df_creacion', type: 'char', value: sucursalesObj.df_creacion},
            {name: 'dm_proveedor', type: 'char', value: sucursalesObj.dm_proveedor},
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

//BUSCA TODAS LAS SUCURSALES PERO NO LAS RELACIONADAS A LOS PROVEEDORES
const getSucursalesSinProveedor = async(req, res = response) => {
    //Sql
    try {
        var total = 0;
        var sql = `SELECT * FROM tb_sucursales where dm_vigente = 'S' and dm_proveedor = 'N'`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
        ])

        var total = 0;
        var [registros] = resultado.data;
        total = registros.length
        //console.log('Total Registro', total);
        var sql = `SELECT * FROM tb_sucursales WHERE dm_vigente = 'S' and dm_proveedor = 'N'`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
        ])

        var [registros] = resultado.data;
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

//BUSCA TODAS LAS SUCURSALES PERO NO LAS RELACIONADAS A LOS PROVEEDORES
const getSucursalesConProveedor = async(req, res = response) => {
    //Sql
    try {
        var total = 0;
        var sql = `SELECT * FROM tb_sucursales where dm_vigente = 'S' and dm_proveedor = 'S'`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
        ])

        var total = 0;
        var [registros] = resultado.data;
        total = registros.length

        //console.log('Total Registro', total);
        var sql = `SELECT * FROM tb_sucursales WHERE dm_vigente = 'S' and dm_proveedor = 'S'`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
        ])

        var [registros] = resultado.data;
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
    getSucursales,
    getSucursalesByCodigo,
    crearActualizaSucursales,
    getSucursalesSinProveedor,
    getSucursalesConProveedor
}