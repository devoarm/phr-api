import knex, { Knex } from "knex";
import dotenv from "dotenv";

const dbHdc: Knex = knex({
  client: "mysql2",
  connection: {
    host: process.env.hostPHR,
    port: 3306,
    user: process.env.userPHR,
    password: process.env.passwordPHR,
    database: process.env.databasePHR,
  },
  pool: {
    min: 0,
    max: 7,
    afterCreate: (conn: any, done: any) => {
      conn.query("SET NAMES utf8mb4", (err: any) => {
        done(err, conn);
      });
    },
  },
});

export default dbHdc;
