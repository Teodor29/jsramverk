import express from "express";
import documents from "../docs.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const result = await documents.getAll();
    res.json(result);
});

router.get("/:id", async (req, res) => {
    const result = await documents.getOne(req.params.id);
    if (!result) {
        return res.status(404).json({ error: "Document not found" });
    }
    res.json(result);
});

router.post("/", async (req, res) => {
    const result = await documents.addOne(req.body);
    res.status(201).json({ id: result.insertedId });
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
    res.json({ message: "Document updated" });
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const result = await documents.deleteOne(id);
    if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Document not found" });
    }
    res.json({ message: "Document deleted" });
});

export default router;
