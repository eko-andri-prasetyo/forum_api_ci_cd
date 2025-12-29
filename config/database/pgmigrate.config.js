/* istanbul ignore file */
/**
 * node-pg-migrate configuration.
 *
 * This project uses PG* env vars for runtime and *_TEST vars for test runtime.
 * We provide this config so `npm run migrate` works consistently.
 */

require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

const db = isTest
  ? {
      host: process.env.PGHOST_TEST,
      port: process.env.PGPORT_TEST,
      user: process.env.PGUSER_TEST,
      password: process.env.PGPASSWORD_TEST,
      database: process.env.PGDATABASE_TEST,
    }
  : {
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    };

module.exports = {
  db,
  migrationsDir: 'migrations',
};
