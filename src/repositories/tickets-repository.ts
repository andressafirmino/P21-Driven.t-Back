import { prisma } from "@/config"
import { Prisma, TicketStatus, TicketType } from "@prisma/client"

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
        where: { userId },
    })
    return user;
}

async function postTicket(enrollmentId: number, ticketTypeId: number) {
    const ticket = await prisma.ticket.create({
        data: {
            ticketTypeId,
            enrollmentId,
            status: "RESERVED"
        },
        include: { TicketType: true },
    })
    return ticket
}

async function getTicketById(ticketId: number) {
    const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { TicketType: true }
    })
    return ticket;
}

async function ticketProcessPayment(ticketId: number) {
    const result = prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: TicketStatus.PAID,
      },
    });
  
    return result;
  }

  async function getTicketByEnrollmentId(enrollmentId: number) {
    const result = await prisma.ticket.findUnique({
      where: { enrollmentId },
      include: { TicketType: true },
    });
  
    return result;
  }

export const ticketsRepository = {
    getTicketType,
    getTicket,
    checkUser,
    postTicket,
    getTicketById,
    ticketProcessPayment,
    getTicketByEnrollmentId
}