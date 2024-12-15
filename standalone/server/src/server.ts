/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";

const app = express();
const port = 3000;

app.get("/", (req: any, res: any) => {
  res.send("Hello from Backend!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
