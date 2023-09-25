import { prisma } from "@/config"
import { PostTicket } from "@/controllers";
import { TicketType } from "@prisma/client"

export type GetTicketType = Omit<TicketType, 'id'>
async function getTicketType() {
    const tickets = await prisma.ticketType.findMany()
    return tickets;
}

async function getTicket(userId: number) {
    const tickets = await prisma.ticket.findUnique({
        where: {enrollmentId: userId},
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

async function checkUser(userId: number) {
    const user = await prisma.enrollment.aggregate({
        _count: {userId: true},
        where: {userId}
    })
    return user;
}

async function postTicket(enrollmentId: number, ticketTypeId: number) {
    const ticket = await prisma.ticket.create({
        data:{
            ticketTypeId,
            enrollmentId,
            status:"RESERVED"
        }
    })
    return ticket
}

export const ticketsRepository = {
    getTicketType,
    getTicket,
    checkUser,
    postTicket
}