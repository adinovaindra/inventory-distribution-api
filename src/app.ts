import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error.middleware";
import { serverAdapter } from "./config/bullboard";
import { globalLimiter } from "./middlewares/ratelimiter.middleware";
import { v1Router } from "./routes/v1.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

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

export default app;
