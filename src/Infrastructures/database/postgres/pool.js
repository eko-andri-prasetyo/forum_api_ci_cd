const { Pool } = require('pg');

const config = {};

// Check if using individual PG* environment variables or DATABASE_URL
if (process.env.DATABASE_URL) {
  config.connectionString = process.env.DATABASE_URL;
  // Always use SSL with rejectUnauthorized false for Aiven
  config.ssl = { rejectUnauthorized: false };
} else if (process.env.PGHOST) {
  // Use individual environment variables
  config.host = process.env.PGHOST;
  config.port = process.env.PGPORT || 5432;
  config.user = process.env.PGUSER;
  config.password = process.env.PGPASSWORD;
  config.database = process.env.PGDATABASE;
  
  // Enable SSL for Aiven or when PGSSLMODE is set
  if (process.env.PGSSLMODE === 'require' || process.env.PGHOST?.includes('aivencloud.com')) {
    config.ssl = { rejectUnauthorized: false };
  }
}

const pool = new Pool(config);

module.exports = pool;
