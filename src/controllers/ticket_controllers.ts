import { Request, Response } from "express";
import redisClient from "../config/redis";
import { getChannel } from "../config/rabbitmq";

export async function bookTicket(req: Request, res: Response) {
  try {
    const { userId } = req.body;
    const remainTicket = await redisClient.decr("ticket_total");

    if (remainTicket < 0) {
      await redisClient.incr("ticket_total");

      return res.status(400).json({ message: "Ticket = 0" });
    }

    const channel = getChannel();
    const message = JSON.stringify({ userId });
    channel.sendToQueue("ticket_queue", Buffer.from(message));

    return res.status(200).json({ message: "ticket booked" });
  } catch (error) {
    console.error("Controller error", error);
    return res.status(500).json({ message: "Server failed" });
  }
}
