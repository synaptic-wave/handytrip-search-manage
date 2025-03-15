import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 변수 로드
dotenv.config({
  path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});

const config = {
  env: process.env.NODE_ENV || "dev",
  port: parseInt(process.env.PORT || "8038", 10),
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "handytrip",
  },
  elasticsearch: {
    node: process.env.ES_NODE || "http://localhost:9200",
    auth: {
      username: process.env.ES_USER || "elastic",
      password: process.env.ES_PASSWORD || "",
    },
  },
};

export default config;
