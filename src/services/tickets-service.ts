import { PostTicket } from "@/controllers";
import { notFoundError, requestError } from "@/errors";
import { enrollmentRepository, ticketsRepository } from "@/repositories"
import httpStatus from "http-status";


async function getTicketType() {
  const ticket = await ticketsRepository.getTicketType();
  return ticket;
}

async function getTicket(userId: number) {
    const ticket = await ticketsRepository.getTicket(userId)
    console.log(ticket)
    if(!ticket) throw notFoundError();
    return ticket;
}

async function postTicket(userId: number, ticketTypeId: number) {
    if(!ticketTypeId) throw requestError(httpStatus.BAD_REQUEST, "ticketTypeId is not valid!");
    if(!userId) throw notFoundError();

    const enrollmentId = await enrollmentRepository.findEnrollmentIdByUserId(userId);
    if(!enrollmentId) throw notFoundError();
    await ticketsRepository.postTicket(enrollmentId, ticketTypeId);
    const ticket = await ticketsRepository.getTicket(enrollmentId);
    return ticket;
}

export const ticketsService = {
    getTicketType,
    getTicket,
    postTicket
}