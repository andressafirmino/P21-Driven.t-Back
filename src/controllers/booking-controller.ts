import { AuthenticatedRequest } from "@/middlewares";
import { BookingId } from "@/protocols";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

async function getBooking(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const booking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
}

async function postBooking(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const { roomId } = req.body;
    const booking = await bookingService.postBooking(userId, roomId);
    return res.status(httpStatus.OK).send({"bookingId": booking.id});
}

async function putBooking(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const { roomId } = req.body;
    const { bookingId} = req.params as BookingId;
    const booking = await bookingService.putBooking(userId, roomId, bookingId);
    return res.status(httpStatus.OK).send({"bookingId": booking.id});
}

const bookingController = {
    getBooking,
    postBooking,
    putBooking
}

export default bookingController;