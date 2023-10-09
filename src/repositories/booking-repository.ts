import { prisma } from "@/config";

async function getBooking(userId: number) {
    const booking = await prisma.booking.findFirst({
        where: { userId},
        include: {Room: true}
    })
    console.log(booking)
    return booking;
}

async function postBooking() {

}

async function putBooking() {

}

const bookingRepository = {
    getBooking,
    postBooking,
    putBooking
}

export default bookingRepository;