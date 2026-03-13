import pool from "../config/database";
import { getChannel } from "../config/rabbitmq";

export const startWorker = async () => {
  try {
    const channel = getChannel();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("👷 Công nhân đã sẵn sàng bốc vác tại 'ticket_queue'...");

    await channel.assertQueue("ticket_queue", { durable: true });

    channel.consume("ticket_queue", async (msg: any) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`📦 [Worker] Lấy được đơn của khách: ${data.userId}`);

          await pool.query("INSERT INTO tickets (user_id) VALUES ($1)", [
            data.userId,
          ]);

          console.log(
            `✅ [Worker] Đã chốt đơn cho ${data.userId} vào DB an toàn!`,
          );

          // Báo cho RabbitMQ biết là "Tao xử lý xong cục này rồi, mày xóa nó khỏi hàng chờ đi"
          channel.ack(msg);
        } catch (err) {
          console.error("❌ [Worker] Lỗi trong quá trình ghi sổ:", err);
        }
      }
    });
  } catch (error) {
    console.error("❌ Lỗi khởi động Worker:", error);
  }
};
