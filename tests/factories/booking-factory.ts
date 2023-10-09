
export async function createBooking(userId?: number, roomId?: number) {
    return {
        data: {
            userId,
            roomId
        }
    }
}

