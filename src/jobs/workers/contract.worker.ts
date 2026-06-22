import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis";
import { contractJob } from "../processors/contract.processor";

const contractWorker = new Worker("contract", contractJob, {
  connection: redisConnection,
});
