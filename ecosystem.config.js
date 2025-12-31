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
        ACCESS_TOKEN_KEY: "f518bcb858699dc4514b5276dc9238c2729d4d133c2bb89f1919af206614b2d6",
        REFRESH_TOKEN_KEY: "78105eb7f668d9595eb67547420990377e53774bc64338d9096bacdd998b149f",
        ACCESS_TOKEN_AGE: "1800",

        // DB Aiven
        DATABASE_URL: "postgres://avnadmin:AVNS_3vxLaq8JJ3C3gAC0jJd@fashiondb-ekoandriprasetyo.k.aivencloud.com:22503/forumapi?sslmode=require",
        PGHOST: "fashiondb-ekoandriprasetyo.k.aivencloud.com",
        PGPORT: "22503",
        PGUSER: "avnadmin",
        PGPASSWORD: "AVNS_3vxLaq8JJ3C3gAC0jJd",
        PGDATABASE: "forumapi",
        PGSSLMODE: "require",
      },
    },
  ],
};
