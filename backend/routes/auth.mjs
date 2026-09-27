import express from "express"
import auth from "../models/auth.mjs"

const router = express.Router()

router.get("/me", async (req, res) => {
  try {
    const result = await auth.getUser(req)

    if (!result) {
      return res.status(401).json({
        error: "Unauthorized",
      })
    }

    res.status(200).json(result)
  } catch (error) {
    console.error("Error getting user:", error)

    res.status(500).json({
      error: "Internal server error",
    })
  }
})

router.post("/login", async (req, res) => {
  try {
    const result = await auth.login(req.body.email, req.body.password)

    return res.status(200).json(result)
  } catch (error) {
    console.error("Error logging in:", error)

    return res.status(401).json({
      error: error.message,
    })
  }
})

router.post("/register", async (req, res) => {
  try {
    await auth.register(req.body.email, req.body.password)

    res.status(201).json({
      message: "User registered successfully",
    })
  } catch (error) {
    console.error("Error registering user:", error)

    return res.status(400).json({
      error: error.message,
    })
  }
})

export default router
