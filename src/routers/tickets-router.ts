import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { ticketsController } from "@/controllers";
import { postTicketSchema } from "@/schemas/tickets=schemas";

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', ticketsController.getTicketType)
    .get('/', ticketsController.getTicket)
    .post('/', validateBody(postTicketSchema), ticketsController.postTicket)

export { ticketsRouter };