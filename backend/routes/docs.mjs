import express from "express"
import documents from "../models/docs.mjs"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const result = await documents.getAll(req.user.email)

    res.status(200).json(result)
  } catch (error) {
    console.error("Error getting documents:", error)

    res.status(500).json({
      error: "Internal server error",
    })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const result = await documents.getOne(req.params.id, req.user.email)

    if (!result) {
      return res.status(404).json({
        error: "Document not found",
      })
    }

    res.status(200).json(result)
  } catch (error) {
    console.error("Error getting document:", error)

    res.status(500).json({
      error: "Internal server error",
    })
  }
})

router.post("/", async (req, res) => {
  try {
    const result = await documents.addOne(req.body, req.user._id)

    res.status(201).json(result)
  } catch (error) {
    console.error("Error creating document:", error)

    res.status(500).json({
      error: "Internal server error",
    })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const title = req.body.title
    const content = req.body.content

    if (!title || !content) {
      return res.status(400).json({
        error: "Title and content are required",
      })
    }

    const result = await documents.updateOne(
      req.params.id,
      req.user.email,
      title,
      content,
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: "Document not found",
      })
    }

    res.status(200).json(result)
  } catch (error) {
    console.error("Error updating document:", error)

    res.status(500).json({
      error: "Internal server error",
    })
  }
})

router.post("/share/:id", async (req, res) => {
  try {
    const email = req.body.email

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      })
    }

    const result = await documents.shareDocument(
      req.params.id,
      req.user._id,
      email,
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: "Document not found",
      })
    }

    res.status(200).json(result)
  } catch (error) {
    console.error("Error sharing document:", error)

    res.status(500).json({
      error: "Internal server error",
    })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const result = await documents.deleteOne(req.params.id, req.user.email)

    if (!result || result.deletedCount === 0) {
      return res.status(404).json({
        error: "Document not found",
      })
    }

    res.status(200).json(result)
  } catch (error) {
    console.error("Error deleting document:", error)

    res.status(500).json({
      error: "Internal server error",
    })
  }
})

export default router
