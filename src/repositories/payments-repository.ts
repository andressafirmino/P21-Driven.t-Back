import { prisma } from "@/config"

async function getPayment(ticketId: number) {
    const ticket = await prisma.payment.findUnique({
        where: {ticketId}
    })
    return ticket;
}

async function postPayment() {
    
}

export const paymentRepository = {
    getPayment,
    postPayment
}