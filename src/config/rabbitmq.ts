import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

let connection: any;
let channel: any;

export async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    channel = await connection.createChannel();
    console.log("ket noi thanh cong rabbitmq");
  } catch (error) {
    console.error("khong ket noi thanh cong rabbitmq");
    process.exit(1);
  }
}

export const getChannel = () => {
  if (!channel) throw new Error("RabbitMQ channel chưa sẵn sàng!");

  return channel;
};
