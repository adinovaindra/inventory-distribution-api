import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import redis from "./config/redis";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Inventory Distribution API is running!",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  await redis.connect()
});

export default app;
