// routes/document_json_routes.mjs

import express from 'express';
import { ObjectId } from 'mongodb'; // Import ObjectId for MongoDB operations
import documents from '../docs.mjs'; // Ensure this path is correct

const router = express.Router();

// API to get all documents as JSON
router.get("/", async (req, res) => {
    try {
        const docs = await documents.getAll();
        res.json(docs); // Respond with JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});

// API to get a single document by ID as JSON
router.get("/:id", async (req, res) => {
    try {
        const doc = await documents.getOne(req.params.id);
        if (!doc) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json(doc); // Respond with JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch document' });
    }
});

// API to add a new document
router.post("/", async (req, res) => {
    try {
        const result = await documents.addOne(req.body);
        res.status(201).json({ id: result.insertedId }); // Respond with the new document's ID
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add document' });
    }
});

// API to update an existing document
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    try {
        const result = await documents.updateOne(id, { title, content });
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ message: 'Document updated' }); // Respond with a success message
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update document' });
    }
});

// API to delete an existing document
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await documents.deleteOne(id); // Assuming you have a deleteOne method
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ message: 'Document deleted' }); // Respond with a success message
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
});

export default router;
