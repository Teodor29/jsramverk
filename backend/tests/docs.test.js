import { jest } from "@jest/globals";
import request from "supertest";
import app from "../app.mjs";
import { closeDb } from "../db/database.mjs";

describe("Docs API", () => {
    let id = 0;

    test("GET /api", async () => {
        const res = await request(app).get("/api");
        expect(res.statusCode).toBe(200);
    });

    test("POST /api", async () => {
        const res = await request(app).post("/api").send({
            title: "New title",
            content: "New content",
        });
        id = res.body.id;
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
    });

    test("Get /api/:id", async () => {
        const res = await request(app).get(`/api/${id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("title", "New title");
        expect(res.body).toHaveProperty("content", "New content");
    });

    test("PUT /api/:id", async () => {
        const res = await request(app).put(`/api/${id}`).send({
            title: "Updated title",
            content: "Updated content",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Document updated");
    });

    test("GET /api/:id", async () => {
        const res = await request(app).get(`/api/${id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("title", "Updated title");
        expect(res.body).toHaveProperty("content", "Updated content");
    });

    test("DELETE /api/:id", async () => {
        const res = await request(app).delete(`/api/${id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Document deleted");
    });
});

describe("Docs API Error Handling", () => {
    test("GET /api/:id", async () => {
        const res = await request(app).get("/api/invalid-id");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error", "Document not found");
    });
});

afterAll(async () => {
    await closeDb();
});
