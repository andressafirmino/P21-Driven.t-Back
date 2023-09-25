import { ticketsService } from "@/services"

async function getTicketType() {
    await ticketsService.getTicketType()
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