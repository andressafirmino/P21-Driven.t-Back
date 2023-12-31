import { forbiddenError, notFoundError, paymentError, requestError } from "@/errors";
import { enrollmentRepository, ticketsRepository } from "@/repositories";
import bookingRepository from "@/repositories/booking-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import { roomRepository } from "@/repositories/room-repository";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";

async function getBooking(userId: number) {
    if (!userId || isNaN(userId)) throw requestError(httpStatus.BAD_REQUEST, 'Invalid userId');

    const booking = await bookingRepository.getBooking(userId);
    if (!booking) throw notFoundError();

    return booking;

}


async function postBooking(userId: number, roomId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.getTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    //const ticketInfo = await ticketsRepository.getTicketById(ticket.id);
    if (ticket.status !== TicketStatus.PAID || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw forbiddenError();

    const room = await roomRepository.getRoomById(roomId);
    if (!room) throw notFoundError();
    const rooms = await bookingRepository.getAllBooking(roomId);
    if (room.capacity <= rooms) throw forbiddenError();

    const booking = await bookingRepository.postBooking(userId, roomId);

    return booking;
}

async function putBooking(userId: number, roomId: number, bookingId: string) {
    const id = parseInt(bookingId);

    //if(isNaN(id)) throw requestError(httpStatus.BAD_REQUEST, 'Invalid bookingId');
    const room = await roomRepository.getRoomById(roomId);
    if (!room) throw notFoundError();
    const rooms = await bookingRepository.getAllBooking(roomId);
    if (room.capacity <= rooms) throw forbiddenError();

    const booking = await bookingRepository.getBooking(userId);
    if (!booking) throw forbiddenError();

    const bookingUpdate = await bookingRepository.putBooking(roomId, parseInt(bookingId));
    if (!bookingUpdate) throw forbiddenError();

    return bookingUpdate;

}

const bookingService = {
    getBooking,
    postBooking,
    putBooking
}

export default bookingService;