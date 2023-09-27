/* 
    Logica que se ejecutara para la ruta que necesita realizar las funciones
    llamado Origen: /index
    Ruta:           /api/tablas
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


const getTipo = async(req, res = response) => {
    //Sql
    try {
        var total = 0;
        var sql = `SELECT * FROM tb_tipo where dm_vigente = 'S' order by id_tipo`;

        var resultado = await conectarSqlServer.executeQuery(sql, [
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
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const getCategoria = async(req, res = response) => {
    try {
        const sql = `select * from tb_categoria where dm_vigente = 'S' order by id_categoria`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
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

const getTipoDocumento = async(req, res = response) => {
    try {
        const sql = `SELECT * FROM tb_tipos_documento where dm_vigente = 'S' order by id_tipo_documento`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
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

const getTipoIngreso = async(req, res = response) => {
    try {
        const sql = `SELECT * FROM tb_tipos_ingreso where dm_vigente = 'S' order by id_tipo_ingreso`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
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
module.exports = {
    getTipo,
    getCategoria,
    getTipoDocumento,
    getTipoIngreso
}