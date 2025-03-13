import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || "development";
const envFile = `.env.${env}`;

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export default {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "8080"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "HANDYTRIP",
  },
  elasticsearch: {
    node: process.env.ES_NODE || "http://localhost:9200",
    username: process.env.ES_USERNAME || "elastic",
    password: process.env.ES_PASSWORD || "",
  },
};
