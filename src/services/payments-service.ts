import { invalidDataError, notFoundError, unauthorizedError } from '@/errors';
import { CardPaymentParams, PaymentParams } from '@/protocols';
import { enrollmentRepository, paymentRepository, ticketsRepository } from '@/repositories';

async function verifyTicketAndEnrollment(userId: number, ticketId: number) {
  if (!ticketId || isNaN(ticketId)) throw invalidDataError('ticketId');

  const ticket = await ticketsRepository.getTicketById(ticketId);
  if (!ticket) throw notFoundError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

  return { ticket, enrollment };
}

async function getPaymentByTicketId(userId: number, ticketId: number) {
  await verifyTicketAndEnrollment(userId, ticketId);

  const payment = await paymentRepository.getPayment(ticketId);

  return payment;
}

async function paymentProcess(ticketId: number, userId: number, cardData: CardPaymentParams) {
  const { ticket } = await verifyTicketAndEnrollment(userId, ticketId);

  const paymentData: PaymentParams = {
    ticketId,
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
  };

  const payment = await paymentRepository.postPayment(ticketId, paymentData);
  await ticketsRepository.ticketProcessPayment(ticketId);
  return payment;
}

export const paymentsService = {
  getPaymentByTicketId,
  paymentProcess,
};
