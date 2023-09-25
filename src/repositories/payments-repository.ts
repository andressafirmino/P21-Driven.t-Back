import { prisma } from "@/config"
import { PaymentProcess } from "@/protocols";

async function getPayment(ticketId: number) {
    const ticket = await prisma.payment.findUnique({
        where: {ticketId}
    })
    return ticket;
}

async function postPayment(body: PaymentProcess) {
    
}

export const paymentRepository = {
    getPayment,
    postPayment
}