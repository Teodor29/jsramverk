import { afterAll, beforeAll, describe, expect, it } from "vitest"
import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../app.mjs"
import { closeDb, openDb } from "../db/database.mjs"

let mongod
let token
const email = "test@test.com"
const password = "test"

beforeAll(async () => {
  process.env.JWT_SECRET = "secret"
  mongod = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongod.getUri()
  await openDb()
})

afterAll(async () => {
  await closeDb()
  await mongod.stop()
})

describe("POST /api/auth/register", () => {
  it("registrerar en användare", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ email, password })
      .expect(201)

    expect(response.body.message).toBe("User registered successfully")
  })
})

describe("POST /api/auth/login", () => {
  it("loggar in och returnerar en token", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email, password })
      .expect(200)

    expect(response.body.token).toBeDefined()
    token = response.body.token
  })
})

describe("GET /api/auth/me", () => {
  it("returnerar den inloggade användaren", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)

    expect(response.body.email).toBe(email)
  })
})
