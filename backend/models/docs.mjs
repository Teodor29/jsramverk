import { getDb } from "../db/database.mjs";
import { ObjectId } from "mongodb";
import auth from "./auth.mjs";

const docs = {
    getAll: async function getAll(userEmail) {
        try {
            const db = getDb();
            const users = await db.collection("users").find({}).toArray();

            if (!users) {
                return [];
            }

            let usersDocs = [];

            users.forEach((user) => {
                if (!user.docs) {
                    return;
                }
                user.docs.forEach((doc) => {
                    if (user.email === userEmail) {
                        usersDocs.push(doc);
                    } else if (doc.allowed_users.includes(userEmail)) {
                        usersDocs.push(doc);
                    }
                });
            });
            return usersDocs;
        } catch (error) {
            console.error("Error fetching documents:", error);
            return [];
        }
    },

    getOne: async function getOne(docId, userEmail) {
        try {
            const db = getDb();

            const user = await db.collection("users").findOne({
                "docs._id": new ObjectId(docId),
            });

            if (!user || !user.docs) {
                return null;
            }

            const doc = user.docs.find((d) => d._id.toString() === docId);

            if (!doc) {
                return null;
            }

            if (
                user.email === userEmail ||
                doc.allowed_users.includes(userEmail)
            ) {
                return doc;
            }

            return doc
        } catch (error) {
            console.error("Error fetching document:", error);
            return null;
        }
    },

    addOne: async function addOne(body, userId) {
        try {
            const db = getDb();

            const result = await db.collection("users").updateOne(
                { _id: new ObjectId(userId) },
                {
                    $push: {
                        docs: {
                            _id: new ObjectId(),
                            title: body.title,
                            content: body.content,
                            created_at: new Date(),
                            updated_at: new Date(),
                            allowed_users: [],
                        },
                    },
                }
            );

            return result;
        } catch (error) {
            console.error("Error adding document:", error);
            return null;
        }
    },

    updateOne: async function updateOne(docId, userId, title, content) {
        try {
            const db = getDb();
            const result = await db.collection("users").updateOne(
                {
                    _id: new ObjectId(userId),
                    "docs._id": new ObjectId(docId),
                },
                {
                    $set: {
                        "docs.$.title": title,
                        "docs.$.content": content,
                        "docs.$.updated_at": new Date(),
                    },
                }
            );

            return result;
        } catch (error) {
            console.error("Error updating document:", error);
            return null;
        }
    },

    shareDocument: async function shareDocument(docId, userId, email) {
        try {
            const db = getDb();

            const user = await db
                .collection("users")
                .findOne({ _id: new ObjectId(userId) });
            const doc = user.docs.find((doc) => doc._id.toString() === docId);

            const result = await db.collection("users").updateOne(
                {
                    _id: new ObjectId(userId),
                    "docs._id": new ObjectId(docId),
                },
                {
                    $addToSet: {
                        "docs.$.allowed_users": email,
                    },
                }
            );

            if (result.modifiedCount > 0 && doc) {
                await auth.sendDocumentSharedEmail(
                    email,
                    user.email,
                    doc.title
                );
            }

            return result;
        } catch (error) {
            console.error("Error sharing document:", error);
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
            console.error("Error deleting document:", error);
            return null;
        }
    },
};

export default docs;
