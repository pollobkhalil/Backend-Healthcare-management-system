import { Request, Response } from "express";
import { ragService } from "./rag.service";

const queryRag = async (req: Request, res: Response) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ success: false, message: "Query is required" });
        }

        // সার্ভিস ফাংশনটি কল করা হলো
        const result = await ragService.queryRagFromDB(query);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error("RAG Error:", error);
        res.status(500).json({ success: false, message: "AI processing failed", error: error.message });
    }
};

const ingestDoctors = async (req: Request, res: Response) => {
    try {
        res.status(200).json({
            success: true,
            message: "Doctors data is ready for AI (Simple RAG).",
            indexedCount: 0
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const ragController = { queryRag, ingestDoctors };