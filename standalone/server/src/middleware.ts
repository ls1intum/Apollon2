import cors from "cors"
import express, { Express } from "express"

export function configureMiddleware(app: Express) {
  app.use(
    cors({
      origin: [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "http://localhost",
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type"],
    })
  )
  app.use(express.json())
}
