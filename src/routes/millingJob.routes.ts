import express from "express"
import { authenticate } from "../middlewares/auth.middleware"
import { createMillingJobController, getAllMillingJobsController, getMillingJobByIdController, updateMillingJobController } from "../controllers/millingJobs.controller"
import { authorize } from "../middlewares/role.middleware"

export const millingJobRouter = express.Router()

millingJobRouter.get("/", authenticate, getAllMillingJobsController)
millingJobRouter.get("/:id", authenticate, getMillingJobByIdController)
millingJobRouter.post("/", authenticate, authorize("ADMIN"), createMillingJobController)
millingJobRouter.put("/:id", authenticate, authorize("ADMIN"), updateMillingJobController)