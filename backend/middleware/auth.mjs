import auth from "../models/auth.mjs"

const authMiddleware = async (req, res, next) => {
  try {
    const user = await auth.getUser(req)

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Authentication error:", error)

    return res.status(401).json({
      error: "Unauthorized",
    })
  }
}

export default authMiddleware
