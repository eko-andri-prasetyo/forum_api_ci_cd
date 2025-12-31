const { nanoid } = require('nanoid');

class IdGenerator {
  constructor() {
    return nanoid; // jadi idGenerator() bisa dipanggil
  }
}

module.exports = IdGenerator;
