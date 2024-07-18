/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

exports.up = function(pgm){
    pgm.createTable('users', {
      id: { type: 'serial', primaryKey: true }, // Assuming 'id' will be a serial primary key
      provider_id: { type: 'varchar(255)', notNull: true }, // To store Google user's ID
      name: { type: 'varchar(255)', notNull: true }, // To store Google profile display name
      family_name: { type: 'varchar(255)' }, // Optional: Store family name, nullable because not all profiles may provide it
      given_name: { type: 'varchar(255)' }, // Optional: Store given name
      email: { type: 'varchar(255)', unique: true, notNull: true }, // Email must be unique and not null
      photo: { type: 'varchar(255)' }, // Optional: Store link to profile photo
      created_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') } // Timestamp when user was created
    });
  };

exports.down = function(pgm){
    pgm.dropTable('users');
};
   