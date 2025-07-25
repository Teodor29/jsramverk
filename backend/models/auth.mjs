import { getDb } from "../db/database.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "email-validator";
import docs from "./docs.mjs";

const auth = {
    verifyToken: async function verifyToken(req, res) {
        const token = req.headers.authorization?.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET;
        console.log("Verifying token:", token);
        console.log("Using JWT secret:", jwtSecret);

        try {
            const decoded = jwt.verify(token, jwtSecret);
            console.log("Token is valid for user:", decoded.email);
            return true;
        } catch (error) {
            console.error("Token verification failed:", error);
            return false;
        }
    },

    login: async function login(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const jwtSecret = process.env.JWT_SECRET;

        try {
            const db = getDb();
            const user = await db.collection("users").findOne({ email });

            if (!user) {
                return {
                    error: "User not found",
                }
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            if (isPasswordValid) {
                const payload = { email: user.email };
                const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
                console.log("User documents:", user.docs);
                return {
                    token: token,
                    user: {
                        email: user.email,
                        created_at: user.created_at,
                    },
                    docs: user.docs || [],
                };
            }
            console.error("Invalid password");
            return null;
        } catch (error) {
            console.error("Error logging in:", error);
            return null;
        }
    },

    register: async function register(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        try {
            const db = getDb();
            if (!validator.validate(email)) {
                console.error("Invalid email format");
                return null;
            }
            const existingUser = await db
                .collection("users")
                .findOne({ email });
            if (existingUser) {
                return {
                    error: "User already exists",
                };
            }
            const result = await db.collection("users").insertOne({
                email,
                password: hashedPassword,
                created_at: new Date(),
                docs: [],
            });
            return result;
        } catch (error) {
            console.error("Error registering user:", error);
            return null;
        }
    },
};

export default auth;
