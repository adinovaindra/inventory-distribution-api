import Redis from "ioredis";
import { env } from "./env";

const redisUrl = env.REDIS_URL

const redis = new Redis(redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

redis.on("connect", () => {
  console.log(`Redis connected successfully`);
});

redis.on("error", (err) => {
  console.log(`Redis connection error: ${err}`);
});

export default redis;
