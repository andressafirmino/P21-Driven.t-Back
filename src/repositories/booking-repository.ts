import { prisma } from "@/config";

async function getBooking(userId: number) {
    const booking = await prisma.booking.findFirst({
        where: { userId},
        include: {Room: true}
    })
    console.log(booking)
    return booking;
}

async function postBooking(userId: number, roomId: number) {
    const booking = await prisma.booking.create({
        data: {
            userId,
            roomId
        }
    })
    return booking;
}

async function putBooking(roomId: number, id: number) {
    const booking = await prisma.booking.update({
        where: {id},
        data: {roomId}
    })
    return booking;
}

const bookingRepository = {
    getBooking,
    postBooking,
    putBooking
}

export default bookingRepository;