import express from "express";
import { Request, Response } from "express";
import { catchAsync } from "../utils/errorHandler.js";
import pool from "../config/database.js";
import { ElasticsearchService } from "../services/elasticsearchService.js";
import logger from "../utils/logger.js";
import { RowDataPacket, OkPacket } from "mysql2";

interface NameHistory extends RowDataPacket {
  id: number;
  type: "HOTEL" | "ZONE";
  name_before: string;
  name_after: string;
  target_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: Date;
}

const router = express.Router();
const elasticsearchService = new ElasticsearchService();

// 수정 이력 생성
router.post(
  "/histories",
  catchAsync(async (req: Request, res: Response) => {
    const { type, name_before, name_after, target_id, status } = req.body;

    const connection = await pool.getConnection();
    try {
      await connection.query<OkPacket>("INSERT INTO tbl_manual_name_history (type, name_before, name_after, target_id, status) VALUES (?, ?, ?, ?, ?)", [type, name_before, name_after, target_id, status]);
      res.status(201).json({ message: "수정 이력이 생성되었습니다." });
    } finally {
      connection.release();
    }
  })
);

// 수정 이력 목록 조회
router.get(
  "/histories",
  catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();
    try {
      const [histories] = await connection.query<NameHistory[]>("SELECT * FROM tbl_manual_name_history ORDER BY created_at DESC LIMIT ? OFFSET ?", [limit, offset]);
      const [[{ total }]] = await connection.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM tbl_manual_name_history");

      res.json({ histories, total });
    } finally {
      connection.release();
    }
  })
);

// 수정 이력 상태 업데이트
router.put(
  "/histories/:id/status",
  catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const connection = await pool.getConnection();
    try {
      // 1. 이력 정보 조회
      const [[history]] = await connection.query<NameHistory[]>("SELECT * FROM tbl_manual_name_history WHERE id = ?", [id]);

      if (!history) {
        return res.status(404).json({ message: "수정 이력을 찾을 수 없습니다." });
      }

      // 2. 상태 업데이트
      await connection.query<OkPacket>("UPDATE tbl_manual_name_history SET status = ? WHERE id = ?", [status, id]);

      // 3. 승인된 경우 Elasticsearch 업데이트
      if (status === "approved") {
        try {
          if (history.type === "HOTEL") {
            await elasticsearchService.updateHotel(history.target_id, history.name_after);
          } else if (history.type === "ZONE") {
            await elasticsearchService.updateZone(history.target_id, history.name_after);
          }
          logger.info(`Elasticsearch 업데이트 성공: ${history.type}/${history.target_id}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
          logger.error(`Elasticsearch 업데이트 실패: ${history.type}/${history.target_id}`, error);
          return res.status(500).json({
            message: "상태는 업데이트되었으나, Elasticsearch 업데이트에 실패했습니다.",
            error: errorMessage,
          });
        }
      }

      res.json({ message: "상태가 업데이트되었습니다." });
    } finally {
      connection.release();
    }
  })
);

export default router;
