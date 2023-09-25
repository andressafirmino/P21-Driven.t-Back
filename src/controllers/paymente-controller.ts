import { AuthenticatedRequest } from "@/middlewares";
import { TicketId } from "@/protocols";
import { paymentService } from "@/services/payment-service";
import { Response } from "express";
import httpStatus from "http-status";

async function getPayment(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const {ticketId} = req.query as TicketId
    const payment = await paymentService.getPayment(userId, Number(ticketId))
    return res.status(httpStatus.OK).send(payment);
}

async function postPayment(req: AuthenticatedRequest, res: Response) {
    
}

export const paymentController = {
    getPayment,
    postPayment
}