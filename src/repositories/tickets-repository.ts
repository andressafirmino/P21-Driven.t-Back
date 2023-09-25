import { prisma } from "@/config"
import { TicketType } from "@prisma/client"

export type GetTicketType = Omit<TicketType, 'id'>
async function getTicketType() {
    const tickets = await prisma.ticketType.findMany()
    return tickets;
}

async function getTicket() {
    
}

async function postTicket() {
    
}

export const ticketsRepository = {
    getTicketType,
    getTicket,
    postTicket
}