import express, { Request, Response } from "express";
import { NameHistoryService } from "../services/nameHistoryService";
import { catchAsync } from "../utils/errorHandler";
import { NameChangeRequest, HistoryStatus } from "../types/history";

const router = express.Router();
const nameHistoryService = new NameHistoryService();

router.post(
  "/histories",
  catchAsync(async (req: Request<{}, {}, NameChangeRequest>, res: Response) => {
    const history = await nameHistoryService.createHistory(req.body);
    res.status(201).json(history);
  })
);

router.get(
  "/histories",
  catchAsync(async (req: Request<{}, {}, {}, { page?: string; limit?: string }>, res: Response) => {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const histories = await nameHistoryService.getHistories(page, limit);
    res.json(histories);
  })
);

router.patch(
  "/histories/:id/status",
  catchAsync(async (req: Request<{ id: string }, {}, { status: HistoryStatus }>, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    await nameHistoryService.updateStatus(parseInt(id), status);
    res.status(200).json({ message: "상태가 업데이트되었습니다." });
  })
);

export default router;
