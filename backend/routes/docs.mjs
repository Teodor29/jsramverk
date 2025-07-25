import express from "express";
import documents from "../models/docs.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const result = await documents.getAll();
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: "No documents found" });
    }
});

router.get("/:id", async (req, res) => {
    const result = await documents.getOne(req.params.id);
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: "Document not found" });
    }
});

router.post("/", async (req, res) => {
    const result = await documents.addOne(req.body);
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: "Failed to create document" });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
        return res
            .status(400)
            .json({ error: "Title and content are required" });
    }

    const result = await documents.updateOne(id, { title, content });
    if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Document not found" });
    }
    res.json(result);
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const result = await documents.deleteOne(id);
    if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Document not found" });
    }
    res.json(result);
});

export default router;
