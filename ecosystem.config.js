module.exports = {
  apps: [
    {
      name: "forum-api",
      script: "src/app.js",
      cwd: "/var/www/forum-api",
      env: {
        NODE_ENV: "production",
        NODE_TLS_REJECT_UNAUTHORIZED: "0",
        HOST: "0.0.0.0",
        PORT: "5000",

        // JWT (nama harus PERSIS ini)
        ACCESS_TOKEN_KEY: "access_token_key",
        REFRESH_TOKEN_KEY: "refresh_token_key",
        ACCESS_TOKEN_AGE: "1800",

        // DB Aiven
        DATABASE_URL: "postgres://USER:PASSWORD@HOST:PORT/forumapi?sslmode=require",
        PGHOST: "HOST",
        PGPORT: "PORT",
        PGUSER: "USER",
        PGPASSWORD: "PASSWORD",
        PGDATABASE: "forumapi",
        PGSSLMODE: "require",
      },
    },
  ],
};
