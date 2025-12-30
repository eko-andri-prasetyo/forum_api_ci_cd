const { Pool } = require('pg');
const testConfig = require('../../../../config/database/test.json');

const isTest = process.env.NODE_ENV === 'test';

const pool = isTest
  ? new Pool(testConfig)
  : new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : false,
    });

module.exports = pool;
