import { AuthenticatedRequest } from "@/middlewares"
import { ticketsService } from "@/services"
import { Response } from "express"
import httpStatus from "http-status";

async function getTicketType(req: AuthenticatedRequest, res: Response) {
    const tickets = await ticketsService.getTicketType();
    return res.status(httpStatus.OK).send(tickets);
}

async function getTicket() {
    await ticketsService.getTicket()
}

async function postTicket() {
    await ticketsService.postTicket()
}

export const ticketsController = {
    getTicketType,
    getTicket,
    postTicket
}