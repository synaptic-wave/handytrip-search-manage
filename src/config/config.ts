import dotenv from "dotenv";
import path from "path";
import logger from "../utils/logger";

// 환경 변수 로드
const env = process.env.NODE_ENV || "dev";
const envFile = `.env.${env.replace("development", "dev").replace("production", "prod")}`;
const envPath = path.resolve(process.cwd(), envFile);

const result = dotenv.config({ path: envPath });

if (result.error) {
  logger.error(`환경 설정 파일을 불러오는데 실패했습니다: ${envPath}`);
  throw result.error;
}

const config = {
  env: env,
  port: parseInt(process.env.PORT || "3000", 10),
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "handytrip",
  },
  elasticsearch: {
    node: process.env.ES_NODE || "http://localhost:9200",
    username: process.env.ES_USERNAME || "elastic",
    password: process.env.ES_PASSWORD || "",
  },
};

export default config;
