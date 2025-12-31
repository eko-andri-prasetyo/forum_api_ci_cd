const { Pool } = require('pg');
const fs = require('fs');

const caPath = process.env.PGSSLROOTCERT || '/etc/ssl/aiven/ca.pem';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('sslmode=require')
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

module.exports = pool;
