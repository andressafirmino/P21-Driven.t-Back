import { AuthenticatedRequest } from "@/middlewares";
import { PaymentProcess, TicketId } from "@/protocols";
import { paymentService } from "@/services/payment-service";
import { Response } from "express";
import httpStatus from "http-status";

async function getPayment(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const {ticketId} = req.query as TicketId
    const ticketNumber = parseInt(ticketId)
    const payment = await paymentService.getPayment(userId, ticketNumber)
    return res.status(httpStatus.OK).send(payment);
}

async function postPayment(req: AuthenticatedRequest, res: Response) {
    const body = req.body as PaymentProcess;
    const payment = await paymentService.postPayment(body);
    res.status(httpStatus.OK).send(payment);
}

export const paymentController = {
    getPayment,
    postPayment
}