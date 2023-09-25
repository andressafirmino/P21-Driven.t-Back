import { ticketsRepository } from "@/repositories"


async function getTicketType() {
    await ticketsRepository.getTicketType()
}

async function getTicket() {
    await ticketsRepository.getTicket()
}

async function postTicket() {
    await ticketsRepository.postTicket()
}

export const ticketsService = {
    getTicketType,
    getTicket,
    postTicket
}