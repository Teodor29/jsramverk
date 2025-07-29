import { getDb } from "../db/database.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "email-validator";
import docs from "./docs.mjs";
import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
});

const auth = {
    verifyUser: async function verifyUser(req, res) {
        const token = req.headers.authorization?.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET;
        try {
            const decoded = jwt.verify(token, jwtSecret);
            const db = getDb();
            const user = await db
                .collection("users")
                .findOne({ email: decoded.email });
            if (user) {
                return user;
            }
            return false;
        } catch (error) {
            console.error("Error verifying user:", error);
            return false;
        }
    },

    verifyToken: async function verifyToken(req, res) {
        const token = req.headers.authorization?.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET;

        try {
            const decoded = jwt.verify(token, jwtSecret);
            return true;
        } catch (error) {
            return false;
        }
    },

    sendWelcomeEmail: async function sendWelcomeEmail(email) {
        try {
            const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
                from: `Jsramverk document editor <noreply@${process.env.MAILGUN_DOMAIN}>`,
                to: [email],
                subject: "Välkommen!",
                text: `Här kommer inbjudan till Jsramverk dokumenthanterare från ${email}`,
            });
            console.log("Welcome email sent:", msg);
            return true;
        } catch (error) {
            console.error("Error sending welcome email:", error);
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
                };
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            if (isPasswordValid) {
                const payload = { email: user.email };
                const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
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

            if (result.insertedId) {
                await this.sendWelcomeEmail(email);
            }

            return result;
        } catch (error) {
            console.error("Error registering user:", error);
            return null;
        }
    },
};

export default auth;
