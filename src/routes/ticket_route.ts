import { Router } from "express";
import { bookTicket } from "../controllers/ticket_controllers.ts";

const router = Router();

router.post("/book", bookTicket);

export default router;
