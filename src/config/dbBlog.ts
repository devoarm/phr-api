import knex, { Knex } from 'knex';

import dotenv from "dotenv";
dotenv.config();

const dbBlog:Knex = knex({
  client: "mysql2",
  connection: {
    host: process.env.hostAPP,
    port: 3306,
    user: process.env.userAPP,
    password: process.env.passwordAPP,
    database: process.env.databaseAPP,
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

export default dbBlog;
