const fs = require('fs');

module.exports = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync('/etc/ssl/aiven/ca.pem').toString(),
    rejectUnauthorized: true,
  },
};
