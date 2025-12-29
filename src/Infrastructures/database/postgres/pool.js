/* istanbul ignore file */
const { Pool } = require('pg');

// Dicoding starter style: test DB config is taken from config/database/test.json
// so migration & tests do not depend on custom *_TEST env vars.
const testConfig = require('../../../../config/database/test.json');

const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool();

module.exports = pool;
