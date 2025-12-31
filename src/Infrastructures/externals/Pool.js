const pool = require('../database/postgres/pool');

class Pool {
  constructor() {
    return pool; // kunci: instance yang keluar adalah pool pg asli => punya .query()
  }
}

module.exports = Pool;
