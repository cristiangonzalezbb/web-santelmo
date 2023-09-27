//File System: Paquete para leer las carpetas
const fs = require('fs');
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


const borrarImagen = (path) =>{
    //console.log('Pregunta si el archivo existe', path);
    if ( fs.existsSync( path ) ) {
        //Borrar la imagen anterior
        //console.log('Encontro el archivo');
        fs.unlinkSync( path );
        //console.log('Borre el archivo');
    }
}

const actualizarImagen = async(tipo, dc_codigo, nombreArchivo) => {

    let pathViejo = '';
    // console.log('Vamos Bien');

    switch ( tipo ) {
    case 'usuario':
        // busco usuario
        var sql = 'select * from tb_usuarios where dc_usuario = @dc_usuario';
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'dc_usuario', type: 'char', value : dc_codigo},
            ])
        

        //Cuenta la cantidad de registros dentro del arreglo de objetos
        var contador = 0;
        var dg_imagen = '';
        resultado.data.forEach(element => {
            element.forEach(datos => {
                dg_imagen = datos[('dg_imagen')];
                contador = contador + 1;
                }) 
            }
        ); 
        //Fin de contador
        if (contador === 0) {
            //console.log('No existe el usuario');
            return false;
        } else {
            //console.log('a',results[0]);
            //console.log('imagen en la base',dg_imagen);
            pathViejo = `./uploads/usuario/${ dg_imagen }`;
            //console.log('pathViejo',pathViejo);
            if (dg_imagen.length !== 0) {
                borrarImagen( pathViejo );
            }
            
            //console.log('a',pathViejo);
            //console.log('b',nombreArchivo);

            //actualizo usuario
            var sql = 'update tb_usuarios set dg_imagen = @dg_imagen where dc_usuario = @dc_usuario' ;
            //console.log(sql);
            var resultado = await conectarSqlServer.executeQuery(sql, [
                {name: 'dg_imagen', type: 'varchar', value : nombreArchivo},
                {name: 'dc_usuario', type: 'char', value : dc_codigo},
                ])
            if (resultado.error === false) {
                return true;
            } else {return false;}
        }

    case 'producto':
        // busco usuario
        var sql = `select * from tb_productos where id_producto = ${dc_codigo}`;
        //console.log('sql', sql);
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'id_producto', type: 'int', value : dc_codigo},
            ])

        
        //console.log('Resultado', results)
        //extrae la imagen
        var {dg_imagen} = results[0];

        //console.log('a',results[0]);
        //console.log('imagen en la base',dg_imagen);
        pathViejo = `./uploads/producto/${ dg_imagen }`;
        //console.log('pathViejo',pathViejo);
        if (dg_imagen.length !== 0) {
            borrarImagen( pathViejo );
        }
        
        //console.log('a',pathViejo);
        //console.log('b',nombreArchivo);

        //actualizo usuario
        var sql = `update tb_productos set dg_imagen = '${nombreArchivo}' where id_producto = ${dc_codigo}` ;
        //console.log(sql);
        var resultado = await conectarSqlServer.executeQuery(sql, [
            {name: 'dg_imagen', type: 'varchar', value : nombreArchivo},
            {name: 'id_producto', type: 'int', value : dc_codigo},
            ])
        if (resultado.error === false) {
            return true;
        } else {return false;}
            
                   
        break;
    }
}

module.exports = {
    actualizarImagen
};
