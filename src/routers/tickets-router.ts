import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { ticketsController } from "@/controllers";

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', ticketsController.getTicketType)
    .get('/', ticketsController.getTicket)
    .post('', ticketsController.postTicket)

export { ticketsRouter };