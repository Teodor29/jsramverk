import express from "express";
import documents from "../models/docs.mjs";
import auth from "../models/auth.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const user = await auth.verifyUser(req, res);
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await documents.getAll(user.email);
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: "No documents found" });
    }
});

router.get("/:id", async (req, res) => {
    const user = await auth.verifyUser(req, res);

    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await documents.getOne(req.params.id, user.email);
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: "Document not found" });
    }
});

router.post("/", async (req, res) => {
    const user = await auth.verifyUser(req, res);
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await documents.addOne(req.body, user._id);
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: "Failed to create document" });
    }
});

router.put("/:id", async (req, res) => {
    const user = await auth.verifyUser(req, res);
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const title = req.body.title;
    const content = req.body.content;

    if (!title) {
        return res
            .status(400)
            .json({ error: "Title and content are required" });
    }

    const result = await documents.updateOne(req.params.id, user._id, title, content);
    if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Document not found" });
    }
    res.json(result);
});

router.post("/share/:id", async (req, res) => {
    const user = await auth.verifyUser(req, res);
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const email = req.body.email;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const result = await documents.shareDocument(req.params.id, user._id, email);
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: "Failed to share document" });
    }
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
