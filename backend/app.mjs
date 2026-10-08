import express from "express"
import cors from "cors"
import docs_routes from "./routes/docs.mjs"
import auth_routes from "./routes/auth.mjs"
import authMiddleware from "./middleware/auth.mjs"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/docs", authMiddleware, docs_routes)
app.use("/api/auth", auth_routes)

export default app
