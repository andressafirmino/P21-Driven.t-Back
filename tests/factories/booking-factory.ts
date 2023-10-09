import { prisma } from "@/config"

export async function createBooking(userId?: number, roomId?: number) {
    
    const data =  {
            userId,
            roomId
        }
    const booking = await prisma.booking.create({
        data,
        select: {
            id: true,
            Room: true
        }
    })

    return booking;
}

