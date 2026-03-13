import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on("error", (error) => {
  console.error("Redis failed", error);
});

export async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (error) {
    console.error("Redis failed to connect", error);
    process.exit(1);
  }
}

export default redisClient;
