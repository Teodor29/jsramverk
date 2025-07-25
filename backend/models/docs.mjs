import { getDb } from "../db/database.mjs";
import { ObjectId } from "mongodb";

const docs = {
    getAll: async function getAll() {
        try {
            const db = getDb();
            const result = await db.collection("documents").find({}).toArray();
            return result;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    getOne: async function getOne(id) {
        try {
            const db = getDb();
            const result = await db
                .collection("documents")
                .findOne({ _id: new ObjectId(id) });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    addOne: async function addOne(body) {
        try {
            const db = getDb();
            const result = await db.collection("documents").insertOne({
                title: body.title,
                content: body.content,
                created_at: new Date(),
            });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    updateOne: async function updateOne(id, body) {
        try {
            const db = getDb();
            const result = await db.collection("documents").updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        title: body.title,
                        content: body.content,
                        updated_at: new Date(),
                    },
                }
            );
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    deleteOne: async function deleteOne(id) {
        try {
            const db = getDb();
            const result = await db
                .collection("documents")
                .deleteOne({ _id: new ObjectId(id) });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
};

export default docs;
