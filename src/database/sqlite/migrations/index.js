const sqliteConnection = require('../../sqlite');
const createUsers = require('./createUsers');

// cria o esquema de tabelas (vazias) do banco de dados - listar todas as tabelas dentro de schemas 
async function migrationsRun() {
    const schemas = [
        createUsers
    ].join('');

    sqliteConnection()
        .then(db => db.exec(schemas))
        .catch(error => console.error(error));        

}

module.exports = migrationsRun;

