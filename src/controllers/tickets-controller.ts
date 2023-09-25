import { AuthenticatedRequest } from "@/middlewares"
import { ticketsService } from "@/services"
import { Response } from "express"
import httpStatus from "http-status";

export type PostTicket = {
    ticketTypeId: string
}

async function getTicketType(req: AuthenticatedRequest, res: Response) {
    const tickets = await ticketsService.getTicketType();
    return res.status(httpStatus.OK).send(tickets);
}

async function getTicket(req: AuthenticatedRequest, res: Response) {
   const userId = req.userId;
   const ticket = await ticketsService.getTicket(userId)
   return res.status(httpStatus.OK).send(ticket);
}

async function postTicket(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const {ticketTypeId} = req.body as {ticketTypeId: number}

    const ticket = await ticketsService.postTicket(userId, ticketTypeId)
    return res.status(httpStatus.CREATED).send(ticket);
}

export const ticketsController = {
    getTicketType,
    getTicket,
    postTicket
}