//LISTO PARA SQL SERVER
//---------------------------
/* 
    Logica que se ejecutara para la ruta que necesita realizar las funciones
    llamado Origen: /index
    Ruta:           /api/usuarios
    Controlador:    /routes/usuarios
*/
const { request, response } = require('express');
const { generarJWT } = require('../helpers/jwt');
//const {conectarSqlServer} = require('../database/configsqlserver')
//para la encriptacion de la clave
const bcrypt = require('bcryptjs');
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


const getUsuarios = async(req, res = response) => {
    //Sql
    try {

        const desde = Number(req.query.desde) || 0;

        var sql = `SELECT * FROM tb_usuarios`;
        //var sql = `SELECT * FROM pbi_usuarios where dm_vigente = @dm_vigente`;
        //var sql = `SELECT count(*) total FROM pbi_funcionarios where dm_vigente = @dm_vigente`;
        var resultado = await conectarSqlServer.executeQuery(sql)
        

        //Transforma el objeto y extrae el total de registros
        //<Begin>
        var total = 0;
        var [registros] = resultado.data;
        total = registros.length
        //<End>


        //console.log(resultado.data);
        //console.log('Total Registro', total);
        
        var sql = 'select top 50 * from tb_usuarios';
        //console.log(sql);
        var resultado = await conectarSqlServer.executeQuery(sql);

        var [registros] = resultado.data;

        //console.log(resultado.data);

        res.status(200).json({
            ok: true,
            dc_usuario: req.dc_usuario,
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

const getUsuariosByCodigo = async(req, res = response) => {
    try {
        const { dc_usuario } = req.params
        const sql = `select * from tb_usuarios where dc_usuario = @dc_usuario and dm_vigente = @dm_vigente`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'dc_usuario', type: 'char', value : dc_usuario},
            {name: 'dm_vigente',  type: 'char', value: 'S'},
            ])

        var [registros] = resultado.data;
        res.status(200).json({
            ok: true,
            registro: registros
        });

    } catch (error) {
        //console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const getUsuariosIngreso = async(req, res = response) => {
    try {
        const usuarioObj = { 
            dc_usuario:         req.body.dc_usuario,
            dg_password:        req.body.dg_password
        };

        //console.log('Server: ', process.env.SQLSERVERHOST, 'User: ',process.env.SQLSERVERUSER, 'Pass: ',process.env.SQLSERVERPASSWORD, 'BD: ',process.env.SQLSERVERDATABASE, 'dg_usuario: ',usuarioObj.dc_usuario)
        var sql = `select * from tb_usuarios where dc_usuario = @dc_usuario and dm_vigente = 'S'`;
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'dc_usuario', type: 'char', value : usuarioObj.dc_usuario},
            {name: 'dm_vigente', type: 'char', value: 'S'},
            ])
        //console.log(sql);
        //Transforma el objeto y extrae el total de registros
        //<Begin>
            var contador = 0;
            var passwordbd = '';
            var [registros] = resultado.data;
            contador = Object.length

            
            //Estraigo la clave del registro leido
            var [ref] = registros;
            passwordbd = ref.dg_password;
        //<End>
   
        if (contador === 0) {
            res.status(402).json({
                ok: true,
                msg: 'La contraseña ingresada no es válida'
            });
        } else {
            //Valido la password
            //console.log('', usuarioObj.dg_password, usuarioObj.dg_password.length);
            //console.log(passwordbd, passwordbd.length);
            //var nuevapass = '';
            //const salt = bcrypt.genSaltSync();
            //nuevapass = bcrypt.hashSync(passwordbd, salt)
            //console.log(nuevapass);
            const validaPassword = bcrypt.compareSync(usuarioObj.dg_password, passwordbd);
            //console.log('Valida Clave', validaPassword);

            //Generar el TOKEN - JWT
            const token = await generarJWT(usuarioObj.dc_usuario);

            if ( !validaPassword ) {
                res.status(400).json({
                    ok: false,
                    msg: 'La contraseña no es válida'
                });    
            } else {
                res.status(200).json({
                    ok: true,
                    token: token,
                    registro: registros
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Hable con el administrador para autorizar el acceso al sistema'
        })
    }
}

const crearUsuario = async (req, res = response) => {
    try {

        //console.log("LLEGO AQUI")
        //Para generar la clave encriptada
        const salt = bcrypt.genSaltSync();
        
        const usuarioObj = { 
            dc_usuario:         req.body.dc_usuario,
            dg_mail:            req.body.dg_mail,
            dg_nombre:          req.body.dg_nombre,
            dg_direccion:       req.body.dg_direccion,
            dg_password:        bcrypt.hashSync(req.body.dg_password, salt),
            id_perfil_usuario:  req.body.id_perfil_usuario,
            dm_admin:           req.body.dm_admin,
            //dg_imagen:          req.body.dg_imagen,
            dm_vigente:         req.body.dm_vigente
        };

        //console.log(usuarioObj.dc_usuario, usuarioObj.dg_mail, usuarioObj.dg_nombre, usuarioObj.dg_direccion, usuarioObj.dg_password, usuarioObj.id_perfil_usuario, usuarioObj.dm_admin, usuarioObj.dm_vigente)
        const sql1 = `exec sp_i_usuario @dc_usuario, @dg_mail, @dg_nombre
                , @dg_direccion, @dg_password, @id_perfil_usuario, @dm_admin
                , @dg_imagen, @dm_vigente`;
        //console.log(sql1);

        var resultado = await conectarSqlServer.executeQuery(sql1, [
        {name: 'dc_usuario', type: 'char', value: usuarioObj.dc_usuario},
        {name: 'dg_mail', type: 'varchar', value: usuarioObj.dg_mail},
        {name: 'dg_nombre', type: 'varchar', value: usuarioObj.dg_nombre},
        {name: 'dg_direccion', type: 'varchar', value: usuarioObj.dg_direccion},
        {name: 'dg_password', type: 'varchar', value: usuarioObj.dg_password},
        {name: 'id_perfil_usuario', type: 'int', value: usuarioObj.id_perfil_usuario},
        {name: 'dm_admin', type: 'char', value: usuarioObj.dm_admin},
        {name: 'dg_imagen', type: 'varchar', value: ''},
        {name: 'dm_vigente', type: 'char', value: 'S'},
        ]);

        //console.log('resultado', resultado);
        res.status(200).json({
            ok: true,
            registro: resultado 
        });     //Transforma el objeto y extrae el total de registros

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const actualizaUsuario = async (req, res = response) => {
    try {
        const dc_usuario=         req.params.dc_usuario;

        const usuarioObj = { 
            dg_nombre:          req.body.dg_nombre,
            dg_direccion:       req.body.dg_direccion,
            dg_password:        req.body.dg_password,
            id_perfil_usuario:  req.body.id_perfil_usuario,
            dm_admin:           req.body.dm_admin,
            dg_imagen:          req.body.dg_imagen,
            dm_vigente:         req.body.dm_vigente
        };

        var sql = `select * from tb_usuarios where dc_usuario = @dc_usuario`;
        //console.log(sql);
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'dc_usuario', type: 'char', value : dc_usuario},
            ])
        //Transforma el objeto y extrae el total de registros
        //<Begin>
            var contador = 0;
            var passwordbd = '';
            var [registros] = resultado.data;
            contador = Object.length

            //Estraigo la clave del registro leido
            const [ref] = registros;
            passwordbd = ref.dg_password;
        //<End>

        //Si la clave es blanco, entonces se queda la misma clave
        if (contador !== 0){
            if (usuarioObj.dg_password.length === 0) {
                //console.log('clave', dg_password)
                usuarioObj.dg_password = passwordbd;
            } else {
                //Para generar la clave encriptada
                //console.log('nueva clave');
                const salt = bcrypt.genSaltSync();
                usuarioObj.dg_password = bcrypt.hashSync(usuarioObj.dg_password, salt)
            }

            //console.log('Paso a ejecutar el update');
            const sql = `update tb_usuarios set dg_nombre = @dg_nombre, dg_direccion = @dg_direccion, dg_password = @dg_password, id_perfil_usuario = @id_perfil_usuario, dm_admin = @dm_admin, dg_imagen = @dg_imagen, dm_vigente = @dm_vigente where dc_usuario = @dc_usuario` ;
            var resultado = await conectarSqlServer.executeQuery(sql, [
                {name: 'dg_nombre', type: 'varchar', value: usuarioObj.dg_nombre},
                {name: 'dg_direccion', type: 'varchar', value: usuarioObj.dg_direccion},
                {name: 'dg_password', type: 'varchar', value: usuarioObj.dg_password},
                {name: 'id_perfil_usuario', type: 'int', value: usuarioObj.id_perfil_usuario},
                {name: 'dm_admin', type: 'char', value: usuarioObj.dm_admin},
                {name: 'dg_imagen', type: 'varchar', value: usuarioObj.dg_imagen},
                {name: 'dm_vigente', type: 'char', value: usuarioObj.dm_vigente},
                {name: 'dc_usuario', type: 'char', value: dc_usuario},
                ])
                res.status(202).json({
                    ok: true,
                    registro: usuarioObj
                })
        }
        else {
            res.status(404).json({
                ok: false,
                msg: 'El usuarios No esta registrado'
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

const renewToken = async(req, res = response) => {
    // Este valor fue asignano en validarJWT
    const dc_usuario = req.dc_usuario;
    //console.log('renewToken', dc_usuario);
    // Generar el TOKEN - JWT
    const token = await generarJWT( dc_usuario );
    //console.log('nuevo Token', token);
    // Obtener el usuario por UID

    var sql = `select * from tb_usuarios where dc_usuario = @dc_usuario`;
    var resultado = await conectarSqlServer.executeQuery(sql, [
        {name: 'dc_usuario', type: 'char', value : dc_usuario},
        ])

    //<Begin>
    var contador = 0;
    var [registros] = resultado.data;
    contador = Object.length
    //<End>
    
    if ( contador === 0 ) {
        res.status(404).json({
            ok: false,
            msg: 'El token es invalido'
        });

    } else {
        res.status(200).json({
            ok: true,
            token: token,
            registro: registros
        });
    }
}

module.exports = {
    getUsuarios,
    getUsuariosByCodigo,
    getUsuariosIngreso,
    crearUsuario,
    actualizaUsuario,
    renewToken
}