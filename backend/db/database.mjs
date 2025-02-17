import { MongoClient } from "mongodb";
console.log("openDb");
console.log(process.env.ATLAS_USERNAME);
console.log(process.env.ATLAS_PASSWORD);
let client;
let db;

export async function openDb() {
    if (!client) {
        try {
            let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.vcuu1.mongodb.net?retryWrites=true&w=majority`;

            if (process.env.NODE_ENV === 'test') {
                dsn = "mongodb://localhost:27017/documents";
            }

            client = await MongoClient.connect(dsn);

            db = client.db("jsramverk");
            console.log("Connected to MongoDB");

        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    }
    return { db, client };
}

export async function getCollection() {
    if (!db) {
        await openDb();
    }
    return db.collection("documents");
}
