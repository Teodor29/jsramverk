import { MongoClient } from "mongodb";

let client;
let db;

async function openDb() {
    if (!client) {
        try {
            console.log("Connecting to MongoDB...");
            let url = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.vcuu1.mongodb.net?retryWrites=true&w=majority`;

            if (process.env.NODE_ENV === "test") {
                url = "mongodb://localhost:27017/test";
            }

            client = await MongoClient.connect(url);
            db = client.db("jsramverk");
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Failed to connect to MongoDB:", error);
            throw error;
        }
    }
    return { db, client };
}

async function closeDb() {
    if (client) {
        try {
            await client.close();
            console.log("MongoDB connection closed");
        } catch (error) {
            console.error("Failed to close MongoDB connection:", error);
        }
        client = null;
        db = null;
    }
}

function getDb() {
    if (!db) {
        throw new Error("Database not connected. Call openDb() first.");
    }
    return db;
}

export { openDb, closeDb, getDb };
