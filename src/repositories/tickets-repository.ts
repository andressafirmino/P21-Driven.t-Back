import { prisma } from "@/config"
import { Prisma, TicketType } from "@prisma/client"

async function getTicketType() {
    const tickets = await prisma.ticketType.findMany()
    return tickets;
}

async function getTicket(enrollmentId: number) {
    const tickets = await prisma.ticket.findUnique({
        where: { enrollmentId },
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
        _count: { userId: true },
        where: { userId }
    })
    return user;
}

async function postTicket(enrollmentId: number, ticketTypeId: number) {
    const ticket = await prisma.ticket.create({
        data: {
            ticketTypeId,
            enrollmentId,
            status: "RESERVED"
        }
    })
    return ticket
}

async function getTicketById(ticketId: number) {
    const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId }
    })
    return ticket;
}

async function getTicketByUserId(userId: number, ticketId: number) {
    const ticket = await prisma.$queryRaw(
        Prisma.sql`
        SELECT t.id, e."userId"
        FROM ticket as t
        JOIN enrollment as e ON t.id = $1
        WHERE e."userId" = $2
        `, [ticketId, userId]
    )
    return ticket;
}

export const ticketsRepository = {
    getTicketType,
    getTicket,
    checkUser,
    postTicket,
    getTicketById,
    getTicketByUserId
}