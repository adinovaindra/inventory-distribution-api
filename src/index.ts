import express from "express";
import cors from "cors";
import helmet from "helmet";
import redis from "./config/redis";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";
import { authRouter } from "./routes/auth.routes";
import { profileRouter } from "./routes/profile.routes";

const app = express();
const PORT = env.PORT;

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

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/profiles", profileRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  await redis.connect();
});

export default app;
