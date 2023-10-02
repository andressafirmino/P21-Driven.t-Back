import { prisma } from "@/config"
import { PaymentParams, PaymentProcess } from "@/protocols";



async function getPayment(ticketId: number) {
    const ticket = await prisma.payment.findUnique({
        where: {ticketId}
    })
    return ticket;
}

async function postPayment(ticketId: number, params: PaymentParams) {
    const result = await prisma.payment.create({
        data: {
          ticketId,
          ...params,
        },
      });
    
    return result;
}

export const paymentRepository = {
    getPayment,
    postPayment
}