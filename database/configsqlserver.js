// Me conecto con SqlServer
//Importo el SqlServer
const sqlserver = require('mssql');

//console.log(process.env.SQLSERVERDATABASE);
//console.log(process.env.SQLSERVERHOST);

//Seteo la conexion
const dbSettings = {
    user     : process.env.SQLSERVERUSER,
    server   : 'mssql-132344-0.cloudclusters.net',
    port     : 19118,
    password : process.env.SQLSERVERPASSWORD,
    database : process.env.SQLSERVERDATABASE,
    options: {
        encrypt  : true, //for Azure
        trustServerCertificate: true // Cambiar a true para local dev / self-signer certs
    }
};


//console.log(dbSettings);
//Todo esto crea una promesa
const dbConnectionSqlServer = async() => {
    try {
        const pool = await sqlserver.connect(dbSettings);
        console.log('DB Online');
        return pool;
        
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD en SqlServer ver logs');
    }
}

module.exports = {
    dbConnectionSqlServer
}