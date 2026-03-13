import { Request, Response } from "express";
import redisClient from "../config/redis";
import { getChannel } from "../config/rabbitmq";

export const bookTicket = async (req: Request, res: Response) => {
  const userId = req.body.userId;

  try {
    const remainTicket = await redisClient.decr("ticket_total");

    if (remainTicket < 0) {
      await redisClient.incr("ticket_total");
      return res.status(400).json({ message: "Sold out" });
    }

    const channel = getChannel();

    const message = JSON.stringify({ userId });

    try {
      await channel.assertQueue("ticket_queue", { durable: true });

      channel.sendToQueue("ticket_queue", Buffer.from(message), {
        persistent: true,
      });

      return res.json({
        message: "Ticket booked",
        remaining: remainTicket,
      });
    } catch (err) {
      await redisClient.incr("ticket_total");

      console.error("Queue error:", err);

      return res.status(500).json({
        message: "Booking failed",
      });
    }
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
