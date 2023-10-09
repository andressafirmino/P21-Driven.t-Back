import bookingController from "@/controllers/booking-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter
    .all('/*', authenticateToken)
    .get('/', bookingController.getBooking)
    .post('/', bookingController.postBooking)
    .put('/:bookingId', bookingController.putBooking)

export { bookingRouter };