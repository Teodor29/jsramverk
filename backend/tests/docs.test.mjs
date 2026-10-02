import { afterAll, beforeAll, describe, expect, it } from "vitest"
import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../app.mjs"
import { closeDb, openDb } from "../db/database.mjs"

let mongod
let token
let docId
const email = "test@test.com"
const password = "test"

beforeAll(async () => {
  process.env.JWT_SECRET = "secret"
  mongod = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongod.getUri()
  await openDb()

  await request(app)
    .post("/api/auth/register")
    .send({ email, password })
    .expect(201)

  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({ email, password })
    .expect(200)

  token = loginResponse.body.token
})

afterAll(async () => {
  await closeDb()
  await mongod.stop()
})

describe("POST /api/docs", () => {
  it("skapar ett dokument", async () => {
    const response = await request(app)
      .post("/api/docs")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Dokument", content: "Innehåll" })
      .expect(201)

    expect(response.body.matchedCount).toBe(1)
  })
})

describe("GET /api/docs", () => {
  it("nekar åtkomst utan token", async () => {
    const response = await request(app).get("/api/docs").expect(401)

    expect(response.body.error).toBe("Unauthorized")
  })

  it("returnerar användarens dokument", async () => {
    const response = await request(app)
      .get("/api/docs")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)

    docId = response.body[0]._id

    expect(response.body).toBeInstanceOf(Array)
  })
})

describe("GET /api/docs/:id", () => {
  it("returnerar ett dokument", async () => {
    const response = await request(app)
      .get(`/api/docs/${docId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)

    expect(response.body.title).toBe("Dokument")
  })
})

describe("PUT /api/docs/:id", () => {
  it("uppdaterar ett dokument", async () => {
    const response = await request(app)
      .put(`/api/docs/${docId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Uppdaterat dokument", content: "Uppdaterat innehåll" })
      .expect(200)

    expect(response.body.modifiedCount).toBe(1)

    const docResponse = await request(app)
      .get(`/api/docs/${docId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)

    expect(docResponse.body.title).toBe("Uppdaterat dokument")
    expect(docResponse.body.content).toBe("Uppdaterat innehåll")
  })
})

describe("POST /api/docs/share/:id", () => {
  it("kräver en e-post", async () => {
    const response = await request(app)
      .post("/api/docs/share/invalid-id")
      .set("Authorization", `Bearer ${token}`)
      .expect(400)

    expect(response.body.error).toBe("Email is required")
  })
})

describe("DELETE /api/docs/:id", () => {
  it("tar bort ett dokument", async () => {
    const response = await request(app)
      .delete(`/api/docs/${docId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)

    expect(response.body.modifiedCount).toBe(1)
  })
})
