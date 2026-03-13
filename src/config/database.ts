import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

export async function connectDB() {
  try {
    let client = await pool.connect();
    console.log("connect success");
    client.release();
  } catch (error) {
    console.error("failed to connect to db", error);
    process.exit(1);
  }
}

export default pool;
