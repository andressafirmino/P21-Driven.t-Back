import { prisma } from "@/config";

async function getRoomById(id: number) {
    const room = await prisma.room.findFirst({
        where: { id },
        select: {
            capacity: true
        }
    })

    return room;
}

async function getAllRoomById(id: number) {
    const rooms = await prisma.room.count({
        where: { id },        
    })

    return rooms;
}

const roomRepository = {
    getRoomById,
    getAllRoomById
}

export { roomRepository };