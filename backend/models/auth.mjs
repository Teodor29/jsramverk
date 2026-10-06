import { getDb } from "../db/database.mjs"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import validator from "email-validator"
import formData from "form-data"
import Mailgun from "mailgun.js"

const mailgun = new Mailgun(formData)

const auth = {
  getUser: async function getUser(req) {
    const token = req.headers.authorization?.split(" ")[1]
    const jwtSecret = process.env.JWT_SECRET

    try {
      const decoded = jwt.verify(token, jwtSecret)
      const db = getDb()
      const user = await db
        .collection("users")
        .findOne({ email: decoded.email }, { projection: { password: 0 } })

      return user
    } catch (error) {
      console.error("Error verifying user:", error)

      return null
    }
  },

  sendInviteEmail: async function sendInviteEmail(email, docId) {
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY,
    })
    const url = `${process.env.FRONTEND_URL}/documents/${docId}`
    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Jsramverk document editor <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: [email],
      subject: "Ett dokument har delats med dig!",
      html: `
        <p>Du har fått tillgång till ett dokument.</p>
        <a href="${url}">${url}</a>
      `,
      text: `Du har fått tillgång till ett dokument: ${url}`,
    })

    return true
  },

  login: async function login(email, password) {
    const jwtSecret = process.env.JWT_SECRET
    const db = getDb()
    const user = await db.collection("users").findOne({ email })

    if (!user) {
      throw new Error("Invalid email")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error("Invalid password")
    }

    const payload = { email: user.email }
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" })

    return {
      token,
      user: {
        email: user.email,
        _id: user._id,
      },
    }
  },

  register: async function register(email, password) {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const db = getDb()

    if (!validator.validate(email)) {
      throw new Error("Invalid email")
    }

    const existingUser = await db.collection("users").findOne({ email })

    if (existingUser) {
      throw new Error("User already exists")
    }

    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      created_at: new Date(),
      docs: [],
    })

    return result
  },
}

export default auth
