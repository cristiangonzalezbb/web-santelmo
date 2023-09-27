// getTodo
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



const getTodo = async(req, res = response ) =>{

    try {
        
        const busqueda = req.params.busqueda;
        busqueda = '%' + busqueda + '%';
        //var producto;
        var sql = `SELECT * FROM tb_usuarios WHERE dg_nombre like busqueda`;

        var resultado = await conectarSqlServer.executeQuery(sql, [{
            name: 'busqueda', type: 'char', value: busqueda
        }])
        var total = 0;
        var [registros] = resultado.data;
        total = Object.length
        //<End>

        res.status(200).json({
            ok: true,
            msg: 'getTodo',
            registro: registros
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const getDocumentosColeccion = async(req, res = response ) =>{

    try {
        const tabla = req.params.tabla;
        const busqueda = req.params.busqueda;

        switch (tabla) {
            case 'usuario':
                busqueda = '%' + busqueda + '%';
                var sql = `SELECT * FROM tb_usuarios WHERE dg_nombre like @busqueda`;
                var resultado = await conectarSqlServer.executeQuery(sql, [{
                    name: 'busqueda', type: 'char', value: busqueda
                }])
        
                //Transforma el objeto y extrae el total de registros
                //<Begin>
                var total = 0;
                var [registros] = resultado.data;
                total = Object.length
                //console.log(registros);
                //<End>

                res.status(200).json({
                    ok: true,
                    msg: 'Registros para ' + tabla,
                    registro: registros
                });
                break;
            case 'producto':
                busqueda = '%' + busqueda + '%';
                var sql = `SELECT * FROM tb_productos WHERE dg_descripcion like @busqueda`;
                var resultado = await conectarSqlServer.executeQuery(sql, [{
                    name: 'busqueda', type: 'char', value: busqueda
                }])
        
                //Transforma el objeto y extrae el total de registros
                //<Begin>
                var total = 0;
                var [registros] = resultado.data;
                total = Object.length
                //console.log(registros);
                //<End>
        
                res.status(200).json({
                    ok: true,
                    msg: 'Registros para ' + tabla,
                    registro: registros
                });

                break;
                case 'sucursal':
                    busqueda = '%' + busqueda + '%';
                    var sql = `SELECT * FROM tb_sucursales WHERE dg_descripcion like @busqueda`;
                    var resultado = await conectarSqlServer.executeQuery(sql, [{
                        name: 'busqueda', type: 'char', value: busqueda
                    }])
            
                    //Transforma el objeto y extrae el total de registros
                    //<Begin>
                    var total = 0;
                    var [registros] = resultado.data;
                    total = Object.length
                    //console.log(registros);
                    //<End>
            
                    res.status(200).json({
                        ok: true,
                        msg: 'Registros para ' + tabla,
                        registro: registros
                    });
                    break;
            default:
                res.status(400).json({
                    ok: false,
                    msg: 'La tabla tiene que ser usuario/producto/sucursal'
                });
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getTodo,
    getDocumentosColeccion
}