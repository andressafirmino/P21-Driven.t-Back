import { PostTicket } from "@/controllers";
import { notFoundError } from "@/errors";
import { ticketsRepository } from "@/repositories"


async function getTicketType() {
  const ticket = await ticketsRepository.getTicketType();
  return ticket;
}

async function getTicket() {
    const ticket = await ticketsRepository.getTicket()
    if(ticket.length === 0) throw notFoundError();
    return ticket;
}

async function postTicket(ticketTypeId: PostTicket) {
    await ticketsRepository.postTicket(ticketTypeId)
}

export const ticketsService = {
    getTicketType,
    getTicket,
    postTicket
}