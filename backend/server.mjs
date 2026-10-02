import "dotenv/config"
import morgan from "morgan"
import { openDb, closeDb } from "./db/database.mjs"
import { Server } from "socket.io"
import { createServer } from "http"
import app from "./app.mjs"

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://teodor29.github.io"],
    methods: ["GET", "POST"],
  },
})
const port = process.env.PORT || 1337

const liveDocuments = {}

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"))

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("join", (docId) => {
      socket.join(docId)

      if (liveDocuments[docId]) {
        socket.emit("documentUpdated", liveDocuments[docId])
      }
      console.log(`Socket ${socket.id} joined room: ${docId}`)
    })

    socket.on("update", (updatedDoc) => {
      liveDocuments[updatedDoc._id] = updatedDoc

      socket.to(updatedDoc._id).emit("documentUpdated", updatedDoc)
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)
    })
  })

  async function startServer() {
    try {
      await openDb()
      server.listen(port, () => console.log(`Server running on ${port}`))
    } catch (error) {
      console.error("Failed to start server:", error)
      process.exit(1)
    }
  }

  startServer()
}

process.on("SIGINT", async () => {
  console.log("Shutting down server...")
  await closeDb()
  process.exit(0)
})

export default app
