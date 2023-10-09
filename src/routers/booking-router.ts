import bookingController from "@/controllers/booking-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { bookingSchema } from "@/schemas/booking-schema";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter
    .all('/*', authenticateToken)
    .get('/', bookingController.getBooking)
    .post('/', validateBody(bookingSchema), bookingController.postBooking)
    .put('/:bookingId', validateBody(bookingSchema), bookingController.putBooking)

export { bookingRouter };