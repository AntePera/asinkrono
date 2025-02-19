/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('weather', table => {
      table.increments('id')
      table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.timestamp('datum')
      table.string('grad', 255).notNullable()
      table.string('drzava', 255).notNullable()
      table.string('vrijeme', 255).notNullable()
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable('weather')
  };  