import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import docs_routes from "./routes/docs.mjs";
import auth_routes from "./routes/auth.mjs";
import { openDb, closeDb } from "./db/database.mjs";

const app = express();
const port = process.env.PORT || 1337;

app.use(cors());
app.use(express.json());

app.use("/api/docs", docs_routes);
app.use("/api/auth", auth_routes);

// don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
    // use morgan to log at command line
    app.use(morgan("combined")); // 'combined' outputs the Apache style LOGs

    async function startServer() {
        try {
            await openDb();
            app.listen(port, () => console.log(`Server running on ${port}`));
        } catch (error) {
            console.error("Failed to start server:", error);
            process.exit(1);
        }
    };

    startServer();
}

process.on("SIGINT", async () => {
    console.log("Shutting down server...");
    await closeDb();
    process.exit(0);
});

export default app;
