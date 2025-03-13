import express from "express";
import path from "path";
import ejs from "ejs";
import config from "./config/config";
import logger from "./utils/logger";
import { errorHandler } from "./utils/errorHandler";

const app = express();
const port = config.port;

// View 엔진 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// 로깅 미들웨어
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
  });
  next();
});

// 라우트 설정
app.get("/", (req, res) => {
  res.render("index", { title: "데이터 관리 시스템" });
});

// 에러 핸들링
app.use(errorHandler);

// 서버 시작
app.listen(port, () => {
  logger.info(`서버가 http://localhost:${port} 에서 실행 중입니다. (${config.env} 모드)`);
});
