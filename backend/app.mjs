import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import docs_routes from "./routes/docs.mjs";
import auth_routes from "./routes/auth.mjs";
import { openDb, closeDb } from "./db/database.mjs";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
const port = process.env.PORT || 1337;

app.use(cors());
app.use(express.json());

app.use("/api/docs", docs_routes);
app.use("/api/auth", auth_routes);

// don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
    io.on("connection", (socket) => {
        console.info("User connected, socket ID:", socket.id);
        socket.on("create", (docId) => {
            socket.join(docId);
            console.info(`Socket ${socket.id} joined room: ${docId}`);
        });

        socket.on("update", (updatedDoc) => {
            console.info("Document updated:", updatedDoc);
            socket.to(updatedDoc._id).emit("documentUpdated", updatedDoc);
        });

        socket.on("disconnect", () => {
            console.info("User disconnected, socket ID:", socket.id);
        });
    });
    // use morgan to log at command line
    app.use(morgan("combined")); // 'combined' outputs the Apache style LOGs

    async function startServer() {
        try {
            await openDb();
            server.listen(port, () => console.log(`Server running on ${port}`));
        } catch (error) {
            console.error("Failed to start server:", error);
            process.exit(1);
        }
    }

    startServer();
}

process.on("SIGINT", async () => {
    console.log("Shutting down server...");
    await closeDb();
    process.exit(0);
});

export default app;
