import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";
import "./jobs/workers/contract.worker";
import { serverAdapter } from "./config/bullboard";
import { globalLimiter } from "./middlewares/ratelimiter.middleware";
import { v1Router } from "./routes/v1.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();
const PORT = env.PORT;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(globalLimiter);

app.get("/", (req, res) => {
  res.redirect("/api/docs");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Inventory Distribution API is running!",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", v1Router);

app.use("/admin/queues", serverAdapter.getRouter());

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
