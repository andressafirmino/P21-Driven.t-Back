import { notFoundError, requestError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import httpStatus from "http-status";

async function getBooking(userId: number) {
    if(!userId || isNaN(userId)) throw requestError(httpStatus.BAD_REQUEST, 'Invalid userId');

    const booking = await bookingRepository.getBooking(userId);
    if(!booking) throw notFoundError();

    return booking;
    
}

async function postBooking() {
    
}

async function putBooking() {
    
}

const bookingService = {
    getBooking,
    postBooking,
    putBooking
}

export default bookingService;