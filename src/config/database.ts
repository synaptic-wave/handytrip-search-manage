import mariadb from "mariadb";
import config from "./config";

const pool = mariadb.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  connectionLimit: 5,
});

export default pool;
