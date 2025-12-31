module.exports = {
  apps: [
    {
      name: "forum-api",
      script: "src/app.js",
      cwd: "/var/www/forum-api",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: "5000",

        // JWT (nama harus PERSIS ini)
        ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY,
        REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,
        ACCESS_TOKEN_AGE: "1800",

        // DB Aiven
        PGHOST: process.env.PGHOST,
        PGPORT: process.env.PGPORT,
        PGUSER: process.env.PGUSER,
        PGPASSWORD: process.env.PGPASSWORD,
        PGDATABASE: process.env.PGDATABASE,
        PGSSLMODE: "require",
      },
    },
  ],
};
