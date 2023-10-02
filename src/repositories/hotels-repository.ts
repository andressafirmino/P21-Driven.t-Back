import { prisma } from "@/config";


async function getHotels() {
    const hotels = await prisma.hotel.findMany();
    return hotels;
}

async function getHotelId(id: number) {
    const hotel = await prisma.hotel.findUnique({
        where: {id}, 
        include: {Rooms: true}
    })
    return hotel;
}

const hotelsRepository = {
    getHotels,
    getHotelId
}

export default hotelsRepository;