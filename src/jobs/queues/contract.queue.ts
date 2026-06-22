import { Queue } from "bullmq";
import { redisConnection } from "../../config/redis";

export const contractQueue = new Queue("contract", {
    connection : redisConnection
});


