import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

async function getBooking(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const booking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
}

async function postBooking(req: AuthenticatedRequest, res: Response) {
    
}

async function putBooking(req: AuthenticatedRequest, res: Response) {
    
}

const bookingController = {
    getBooking,
    postBooking,
    putBooking
}

export default bookingController;