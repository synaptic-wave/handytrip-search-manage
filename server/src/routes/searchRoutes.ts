import express, { Request, Response } from "express";
import { ElasticsearchService } from "../services/elasticsearchService.js";
import { catchAsync } from "../utils/errorHandler.js";
import logger from "../utils/logger.js";

const router = express.Router();
const elasticsearchService = new ElasticsearchService();

router.get(
  "/search",
  catchAsync(async (req: Request<{}, {}, {}, { type?: string; query?: string }>, res: Response) => {
    const { type, query } = req.query;

    logger.info(`검색 요청: type=${type}, query=${query}`);

    if (!query || typeof query !== "string") {
      logger.warn("검색어가 없거나 유효하지 않음");
      return res.status(400).json({ message: "검색어를 입력해주세요." });
    }

    if (!type || (type !== "HOTEL" && type !== "ZONE")) {
      logger.warn(`유효하지 않은 검색 타입: ${type}`);
      return res.status(400).json({ message: "올바른 검색 타입을 지정해주세요." });
    }

    try {
      const results = type === "HOTEL" ? await elasticsearchService.searchHotels(query) : await elasticsearchService.searchZones(query);

      logger.info(`검색 결과: ${results.length}건 찾음`);
      res.json(results);
    } catch (error) {
      logger.error("검색 중 오류 발생:", error);
      throw error;
    }
  })
);

export default router;
