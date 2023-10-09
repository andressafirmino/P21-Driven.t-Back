import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createHotel() {
    const data = {
        name: faker.company.companyName(),
        image: faker.image.imageUrl()
    }

    const hotel = await prisma.hotel.create({data});
    return hotel;
}

export async function createRoom(hotelId: number, capacity?: number) {
    const data = {
        name: faker.random.word(),
        capacity: capacity || 1,
        hotelId
      }
    const room = await prisma.room.create({data});
    return room;
}