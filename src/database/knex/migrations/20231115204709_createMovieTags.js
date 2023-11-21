exports.up = knex => knex.schema.createTable("tags", table => {
    table.increments("id").primary();
    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users");
    table.text("name").notNullable();
}).then(console.log('created "tags" table'));

exports.down = knex => knex.schema.dropTable("tags")