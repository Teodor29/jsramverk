import { getDb } from "../db/database.mjs"
import { ObjectId } from "mongodb"
import auth from "./auth.mjs"

const docs = {
  getAll: async function getAll(userEmail) {
    const db = getDb()
    const users = await db.collection("users").find({}).toArray()
    let usersDocs = []

    users.forEach((user) => {
      if (!user.docs) {
        return
      }

      user.docs.forEach((doc) => {
        if (user.email === userEmail) {
          usersDocs.push(doc)
        } else if (doc.allowed_users.includes(userEmail)) {
          usersDocs.push(doc)
        }
      })
    })

    return usersDocs
  },

  getOne: async function getOne(docId, userEmail) {
    const db = getDb()
    const user = await db.collection("users").findOne({
      "docs._id": new ObjectId(docId),
    })

    if (!user) {
      return null
    }

    const doc = user.docs.find((d) => d._id.toString() === docId)

    if (!doc) {
      return null
    }

    if (user.email !== userEmail && !doc.allowed_users.includes(userEmail)) {
      return null
    }

    return doc
  },

  addOne: async function addOne(body, userId) {
    const db = getDb()
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
      },
    )

    return result
  },

  updateOne: async function updateOne(docId, userEmail, title, content) {
    const db = getDb()
    const user = await db.collection("users").findOne({
      "docs._id": new ObjectId(docId),
    })

    if (!user) {
      return null
    }

    const doc = user.docs.find((d) => d._id.toString() === docId)

    if (!doc) {
      return null
    }

    if (user.email !== userEmail && !doc.allowed_users.includes(userEmail)) {
      return null
    }

    const result = await db.collection("users").updateOne(
      {
        "docs._id": new ObjectId(docId),
      },
      {
        $set: {
          "docs.$.title": title,
          "docs.$.content": content,
          "docs.$.updated_at": new Date(),
        },
      },
    )

    return result
  },

  shareDocument: async function shareDocument(docId, userId, email) {
    const db = getDb()
    const result = await db.collection("users").updateOne(
      {
        _id: new ObjectId(userId),
        "docs._id": new ObjectId(docId),
      },
      {
        $addToSet: {
          "docs.$.allowed_users": email,
        },
      },
    )

    if (result.modifiedCount > 0) {
      await auth.sendInviteEmail(email, docId)
    }

    return result
  },

  deleteOne: async function deleteOne(docId, userEmail) {
    const db = getDb()
    const user = await db.collection("users").findOne({
      "docs._id": new ObjectId(docId),
    })

    if (!user) {
      return null
    }

    if (user.email !== userEmail) {
      return null
    }

    const result = await db.collection("users").updateOne(
      { "docs._id": new ObjectId(docId) },
      {
        $pull: {
          docs: { _id: new ObjectId(docId) },
        },
      },
    )

    return result
  },
}

export default docs
