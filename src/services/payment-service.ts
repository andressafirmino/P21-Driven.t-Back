import { notFoundError, requestError, unauthorizedError } from "@/errors"
import { ticketsRepository } from "@/repositories";
import { paymentRepository } from "@/repositories/payments-repository";
import httpStatus from "http-status"

async function getPayment(userId: number, ticketId: number) {
    if(!userId) throw requestError(httpStatus.BAD_REQUEST, "userId invalid");
    if(!ticketId) throw requestError(httpStatus.BAD_REQUEST, "ticketId invalid");
    const ticket = await ticketsRepository.getTicketById(ticketId);
    if(!ticket) throw notFoundError();
    /* const ticketByUserId = await ticketsRepository.getTicketByUserId(userId, ticketId);
    if(!ticketByUserId) throw unauthorizedError(); */

    const ticketById = await paymentRepository.getPayment(ticketId);
    return ticketById;
}

async function postPayment() {
    
}

export const paymentService = {
    getPayment,
    postPayment
}