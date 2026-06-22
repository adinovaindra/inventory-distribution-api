import { Queue } from "bullmq";
import { redisConnection } from "../../config/redis";

export const contractQueue = new Queue("contract", {
  connection: redisConnection,
});

contractQueue.add(
  "expired-check",
  {},
  {
    repeat: { pattern: "0 0 * * *" },
  },
);
