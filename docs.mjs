import { openDb } from './db/database.mjs';
import { ObjectId } from 'mongodb';

const { db } = await openDb();

const docs = {
    getAll: async function getAll() {
        try {
            const documents = await db.collection('documents').find({}).toArray();
            return documents;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    getOne: async function getOne(id) {
        try {
            const document = await db.collection('documents').findOne({ _id: new ObjectId(id) });
            return document;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    addOne: async function addOne(body) {
        try {
            const result = await db.collection('documents').insertOne({
                title: body.title,
                content: body.content,
                created_at: new Date()
            });
            return result;
        } catch (error) {
            console.error(error);
        }
    },

    updateOne: async function updateOne(id, body) {
        try {
            const result = await db.collection('documents').updateOne(
                { _id: new ObjectId(id) },
                { $set: { title: body.title, content: body.content, created_at: new Date() } }
            );
            return result;
        } catch (error) {
            console.error(error);
        }
    }
};

export default docs;