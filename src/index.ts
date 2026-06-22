import express from "express";
import cors from "cors";
import helmet from "helmet";
import redis from "./config/redis";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";
import { authRouter } from "./routes/auth.routes";
import { profileRouter } from "./routes/profile.routes";
import { supplierRouter } from "./routes/supplier.routes";
import { productRouter } from "./routes/product.routes";
import { warehouseRouter } from "./routes/warehouse.routes";
import { contractRouter } from "./routes/contract.routes";
import { procurementOrderRouter } from "./routes/procurementOrder.routes";
import { rawMaterialRouter } from "./routes/rawMaterial.routes";
import { productionOrderRouter } from "./routes/productionOrder.routes";
import { stockRouter } from "./routes/stock.routes";
import { vehicleRouter } from "./routes/vehicle.routes";
import { millingJobRouter } from "./routes/millingJob.routes";
import { salesOrderRouter } from "./routes/salesOrder.routes";
import { deliveryRouter } from "./routes/delivery.routes";
import "./jobs/workers/contract.worker";

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

app.use("/api/v1/suppliers", supplierRouter);

app.use("/api/v1/products", productRouter);

app.use("/api/v1/warehouses", warehouseRouter);

app.use("/api/v1/contracts", contractRouter);

app.use("/api/v1/procurement-orders", procurementOrderRouter);

app.use("/api/v1/raw-materials", rawMaterialRouter);

app.use("/api/v1/production-orders", productionOrderRouter);

app.use("/api/v1/stocks", stockRouter);

app.use("/api/v1/vehicles", vehicleRouter);

app.use("/api/v1/milling-jobs", millingJobRouter);

app.use("/api/v1/sales-orders", salesOrderRouter);

app.use("/api/v1/deliveries", deliveryRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  await redis.connect();
});

export default app;
