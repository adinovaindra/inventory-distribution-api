import { rateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../config/redis";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...(args as [string, ...string[]])) as any,
  }),
  message: {
    success: false,
    message: "Too many request!",
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...(args as [string, ...string[]])) as any,
  }),
  message: {
    success: false,
    message: "Too many attempt!",
  },
});
