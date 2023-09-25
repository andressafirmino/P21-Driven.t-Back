import { prisma } from "@/config"
import { PostTicket } from "@/controllers";
import { TicketType } from "@prisma/client"

export type GetTicketType = Omit<TicketType, 'id'>
async function getTicketType() {
    const tickets = await prisma.ticketType.findMany()
    return tickets;
}

async function getTicket() {
    const tickets = await prisma.ticket.findMany({
        select: {
            id: true,
            status: true,
            ticketTypeId: true,
            enrollmentId: true,
            TicketType: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    isRemote: true,
                    includesHotel: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            createdAt: true,
            updatedAt: true,
        },
    });
    return tickets;
}

async function postTicket(ticketTypeId: PostTicket) {

}

export const ticketsRepository = {
    getTicketType,
    getTicket,
    postTicket
}