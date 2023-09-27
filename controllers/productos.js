/* 
    Logica que se ejecutara para la ruta que necesita realizar las funciones
    llamado Origen: /index
    Ruta:           /api/productos
    Controlador:    /routes/productos
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



const getProductos = async(req, res = response) => {
    //Sql
    try {
        const desde = Number(req.query.desde) || 0;

        var total = 0;
        var sql = `SELECT * FROM tb_productos where dm_vigente = 'S'`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
        ])

        var total = 0;
        var [registros] = resultado.data;
        total = registros.length
        
        console.log('Total Registro', total, 'Registro', registros);
        var sql = `SELECT top 10 * FROM tb_productos WHERE dm_vigente = 'S'`;
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
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const getProductosByCodigo = async(req, res = response) => {
    try {
        const { id_producto } = req.params

        var sql = `select * from tb_productos where id_producto = @id_producto and dm_vigente = 'S'`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_producto', type: 'int', value: id_producto},
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

const getProductosByTexto = async(req, res = response) => {
    try {
        const { texto } = req.params

        const sql = `sp_c_producto_texto @texto`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'texto', type: 'varchar', value: texto},
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

const crearActualizaProducto = async (req, res = response) => {
    try {
        const productoObj = { 
            id_producto:        req.body.id_producto,
            dc_producto:        req.body.dc_producto,
            dg_descripcion:     req.body.dg_descripcion,
            id_tipo:            req.body.id_tipo,
            id_categoria:       req.body.id_categoria,
            dq_precio:          req.body.dq_precio,
            dg_imagen:          req.body.dg_imagen,
            dc_usuario:         req.body.dc_usuario,
            df_creacion:        req.body.df_creacion,
            dm_vigente:         req.body.dm_vigente
        };
        
        //console.log('Paso a ejecutar el insert');
        const sql = `sp_p_crea_producto @id_producto, @dc_producto, @dg_descripcion, @id_tipo, @id_categoria, @dq_precio, @dg_imagen, @dc_usuario, @dm_vigente`;
        //console.log('Antes del Insert', sql);
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_producto', type: 'int', value: productoObj.id_producto},
            {name: 'dc_producto', type: 'char', value: productoObj.dc_producto},
            {name: 'dg_descripcion', type: 'varchar', value: productoObj.dg_descripcion},
            {name: 'id_tipo', type: 'int', value: productoObj.id_tipo},
            {name: 'id_categoria', type: 'int', value: productoObj.id_categoria},
            {name: 'dq_precio', type: 'money', value: productoObj.dq_precio},
            {name: 'dg_imagen', type: 'varchar', value: productoObj.dg_imagen},
            {name: 'dc_usuario', type: 'char', value: productoObj.dc_usuario},
            {name: 'df_creacion', type: 'char', value: productoObj.df_creacion},
            {name: 'dm_vigente', type: 'char', value: productoObj.dm_vigente},
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
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


module.exports = {
    getProductos,
    getProductosByCodigo,
    crearActualizaProducto,
    getProductosByTexto
}