import { notFoundError, requestError, unauthorizedError } from "@/errors"
import { CardPaymentParams, PaymentParams, PaymentProcess } from "@/protocols";
import { enrollmentRepository, ticketsRepository } from "@/repositories";
import { paymentRepository } from "@/repositories/payments-repository";
import { User } from "@prisma/client";
import httpStatus from "http-status"


async function checkTicketEnrollment(userId: number, ticketId: number) {
    if(!userId || isNaN(userId) ) throw requestError(httpStatus.BAD_REQUEST, "userId invalid");
    if(!ticketId || isNaN(ticketId)) throw requestError(httpStatus.BAD_REQUEST, "ticketId invalid");

    const ticket = await ticketsRepository.getTicketById(ticketId);
    if (!ticket) throw notFoundError();

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment) throw unauthorizedError();

    if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

    return { ticket, enrollment };
}

async function getPayment(userId: number, ticketId: number) {
    
    await checkTicketEnrollment(userId, ticketId);
    

    const payment = await paymentRepository.getPayment(ticketId);
    return payment;
}

async function postPayment(ticketId: number, userId: number, cardData: CardPaymentParams) {
    if(!ticketId || !cardData) throw requestError(httpStatus.BAD_REQUEST, '');
    const {ticket} = await checkTicketEnrollment(userId, ticketId);
    
    const paymentData: PaymentParams = {
        ticketId: ticketId,
        value: ticket.TicketType.price,
        cardIssuer: cardData.issuer,
        cardLastDigits: cardData.number.toString().slice(-4),
      };
    
      const payment = await paymentRepository.postPayment(ticketId, paymentData);
      await ticketsRepository.ticketProcessPayment(ticketId);
      return payment;
}

export const paymentService = {
    checkTicketEnrollment,
    getPayment,
    postPayment
}