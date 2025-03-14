import express from "express";
import path from "path";
import ejs from "ejs";
import expressLayouts from "express-ejs-layouts";
import config from "./config/config";
import logger from "./utils/logger";
import { errorHandler } from "./utils/errorHandler";
import nameHistoryRoutes from "./routes/nameHistoryRoutes";

const app = express();
const port = config.port;

// View 엔진 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");
app.set("layout extractScripts", true);

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

// API 라우트
app.use("/api", nameHistoryRoutes);

// 웹 페이지 라우트
app.get("/", (req, res) => {
  res.render("index", { title: "검색어 관리 시스템" });
});

app.get("/histories", (req, res) => {
  res.render("histories", { title: "검색어 수정 이력" });
});

// 에러 핸들링
app.use(errorHandler);

// 서버 시작
app.listen(port, () => {
  logger.info(`서버가 http://localhost:${port} 에서 실행 중입니다. (${config.env} 모드)`);
});
