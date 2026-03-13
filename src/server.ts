import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import redisClient, { connectRedis } from "./config/redis";
import { connectRabbitMQ } from "./config/rabbitmq";
import ticketRouter from "./routes/ticket_route";
import { startWorker } from "./workers/ticket_worker.ts";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/tickets", ticketRouter);

async function startServer() {
  try {
    await connectDB();
    await connectRedis();
    await connectRabbitMQ();
    await startWorker();
    await redisClient.set("ticket_total", "10000");

    app.listen(port, () => {
      console.log("server is running");
    });
  } catch (error) {
    console.log("server is not running");
  }
}

startServer();
