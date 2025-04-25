import cors from "cors"
import express, { Express } from "express"
import { errorHandler } from "./errors"
import { configureCors } from "./cors"

export function configureMiddleware(app: Express) {
  app.use(configureCors()) // Configure CORS
  app.use(express.json()) // Add the express.json middleware
  app.use(errorHandler) // Error handling middleware
}
