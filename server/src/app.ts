import express from "express";
import config from "./config/config.js";
import logger from "./utils/logger.js";
import { errorHandler } from "./utils/errorHandler.js";
import nameHistoryRoutes from "./routes/nameHistoryRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import cors from "cors";

const app = express();
const port = config.port;

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:5173", // React 개발 서버
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 로깅 미들웨어
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.body,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

// API 라우트
app.use("/api", nameHistoryRoutes);
app.use("/api", searchRoutes);

// 에러 핸들링
app.use(errorHandler);

// 서버 시작
app.listen(port, () => {
  logger.info(`API 서버가 http://localhost:${port} 에서 실행 중입니다. (${config.env} 모드)`);
});
