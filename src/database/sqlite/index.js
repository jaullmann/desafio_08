const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const path = require("path");  
//esse módulo é necessário para tratar os caminhos de arquivos e diretórios
//em diferentes sistemas operacionais


// a função deve ser assíncrona, porque irá criar e negociar dados com o DB
async function sqliteConnection() {
    const database = await sqlite.open({
        filename: path.resolve(__dirname, '..', "database.db"),
        driver: sqlite3.Database
    });

    return database
}

module.exports = sqliteConnection;