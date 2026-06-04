import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

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
