import pool from "../config/database";
import { NameHistory, NameChangeRequest, HistoryStatus } from "../types/history";
import { AppError } from "../utils/errorHandler";

export class NameHistoryService {
  async createHistory(request: NameChangeRequest): Promise<NameHistory> {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query(
        `INSERT INTO tbl_manual_name_history 
        (type, name_before, name_after, status, target_id) 
        VALUES (?, ?, ?, 'pending', ?)`,
        [request.type, request.name_before, request.name_after, request.target_id]
      );

      return {
        id: result.insertId,
        ...request,
        status: "pending" as HistoryStatus,
        created_at: new Date(),
        updated_at: new Date(),
      };
    } finally {
      conn.release();
    }
  }

  async getHistories(page: number = 1, limit: number = 10): Promise<{ histories: NameHistory[]; total: number }> {
    const conn = await pool.getConnection();
    try {
      const offset = (page - 1) * limit;
      const [histories, [{ total }]] = await Promise.all([
        conn.query(
          `SELECT * FROM tbl_manual_name_history 
          ORDER BY created_at DESC LIMIT ? OFFSET ?`,
          [limit, offset]
        ),
        conn.query("SELECT COUNT(*) as total FROM tbl_manual_name_history"),
      ]);

      return {
        histories: histories.map((h: any) => ({
          ...h,
          created_at: new Date(h.created_at),
          updated_at: new Date(h.updated_at),
        })),
        total,
      };
    } finally {
      conn.release();
    }
  }

  async updateStatus(id: number, status: HistoryStatus): Promise<void> {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query(
        `UPDATE tbl_manual_name_history 
        SET status = ?, updated_at = NOW() 
        WHERE id = ?`,
        [status, id]
      );

      if (result.affectedRows === 0) {
        throw new AppError("수정 이력을 찾을 수 없습니다.", 404);
      }
    } finally {
      conn.release();
    }
  }
}
