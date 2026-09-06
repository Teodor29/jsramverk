import express from "express"
import auth from "../models/auth.mjs"

const router = express.Router()

router.get("/", (req, res) => {
  res.json({ message: "Auth API is working" })
})

router.get("/me", async (req, res) => {
  const result = await auth.getUser(req, res)
  if (result) {
    res.status(200).json(result)
  } else {
    res.status(401).json({ error: "Unauthorized" })
  }
})

router.post("/login", async (req, res) => {
  const result = await auth.login(req, res)
  if (result) {
    res.status(201).json(result)
  } else {
    res.status(401).json({ error: "Invalid username or password" })
  }
})

router.post("/register", async (req, res) => {
  const result = await auth.register(req, res)
  if (result && !result.error) {
    res.status(201).json({ message: "User registered successfully" })
  } else if (result && result.error) {
    res.status(400).json({ error: result.error })
  } else {
    console.error("User registration failed")
    res.status(400).json({ error: "User registration failed" })
  }
})

export default router
