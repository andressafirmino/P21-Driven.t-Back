import { notFoundError, paymentError, requestError } from "@/errors";
import { enrollmentRepository, ticketsRepository } from "@/repositories";
import hotelsRepository from "@/repositories/hotels-repository";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";

async function verifyAccommodation(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.getTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const ticketInfo = await ticketsRepository.getTicketById(ticket.id);
    if (ticketInfo.status !== TicketStatus.PAID || ticketInfo.TicketType.isRemote || !ticketInfo.TicketType.includesHotel) throw paymentError();

    return;
}

async function getHotels(userId: number) {
    await verifyAccommodation(userId);
    const hotels = await hotelsRepository.getHotels();
    if (hotels.length === 0) throw notFoundError();
    return hotels;
}

async function getHotelId(userId: number, id: string) {
    await verifyAccommodation(userId);

    const hotelId = parseInt(id);
    if( isNaN(hotelId)) throw requestError(httpStatus.BAD_REQUEST, "hotelId invalid");
    const hotel = await hotelsRepository.getHotelId(hotelId);
    if(!hotel) throw notFoundError();

    return hotel;
}

const hotelsService = {
    getHotels,
    getHotelId
}

export default hotelsService;