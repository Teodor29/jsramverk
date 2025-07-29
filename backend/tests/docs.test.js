import { jest } from "@jest/globals";
import request from "supertest";
import app from "../app.mjs";
import { openDb, closeDb } from "../db/database.mjs";

beforeAll(async () => {
    await openDb();
});

describe("Docs API", () => {
    let id = "";

    test("GET /api/docs", async () => {
        const res = await request(app).get("/api/docs");
        expect(res.statusCode).toBe(200);
    });

    test("POST /api/docs", async () => {
        const res = await request(app).post("/api/docs").send({
            title: "New title",
            content: "New content",
        });
        id = res.body.id;
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("message", "Document created");
    });

    test("Get /api/docs/:id", async () => {
        const res = await request(app).get(`/api/docs/${id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("title", "New title");
        expect(res.body).toHaveProperty("content", "New content");
    });

    test("PUT /api/docs/:id", async () => {
        const res = await request(app).put(`/api/docs/${id}`).send({
            title: "Updated title",
            content: "Updated content",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Document updated");
    });

    test("GET /api/docs/:id", async () => {
        const res = await request(app).get(`/api/docs/${id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("title", "Updated title");
        expect(res.body).toHaveProperty("content", "Updated content");
    });

    test("DELETE /api/docs/:id", async () => {
        const res = await request(app).delete(`/api/docs/${id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Document deleted");
    });
});

describe("Docs API Error Handling", () => {
    test("GET /api/docs/:id", async () => {
        const res = await request(app).get("/api/docs/invalid-id");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error", "Document not found");
    });
});

afterAll(async () => {
    await closeDb();
});
