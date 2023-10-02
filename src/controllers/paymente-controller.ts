import { AuthenticatedRequest } from "@/middlewares";
import { paymentService } from "@/services/payment-service";
import { Response } from "express";
import httpStatus from "http-status";

async function getPayment(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const ticketId = Number(req.query.ticketId);
    const payment = await paymentService.getPayment(userId, ticketId)
    return res.status(httpStatus.OK).send(payment);
}

async function postPayment(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const {ticketId, cardData} = req.body;
    const payment = await paymentService.postPayment(ticketId, userId, cardData);
    res.status(httpStatus.OK).send(payment);
}

export const paymentController = {
    getPayment,
    postPayment
}