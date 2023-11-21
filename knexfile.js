const path = require("path");

module.exports = {

  development: {

    client: 'sqlite3',
    connection: {
      // "./src/database/database.db"
      filename: path.resolve(__dirname, "src", "database", "database.db")
    },
    pool: {
      // necessário para utilizar o modo CASCADE ao deletar dados vinculados entre tabelas
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    },
    migrations: {
      // "./src/database/knex/migrations"
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
    },
    
    useNullAsDefault: true

  },

};
