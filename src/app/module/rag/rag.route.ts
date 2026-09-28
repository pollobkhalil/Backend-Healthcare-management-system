import { Router } from "express";
import { ragController } from "./rag.controller";

const router = Router();

router.post("/query", ragController.queryRag);
router.post("/ingest-doctors", ragController.ingestDoctors);

export const ragRouter = router;