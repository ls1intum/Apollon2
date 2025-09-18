import cors from "cors"

export function configureCors() {
  return cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
}
