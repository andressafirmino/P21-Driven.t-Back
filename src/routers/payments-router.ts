import { paymentController } from "@/controllers/paymente-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const paymentRouter = Router();

paymentRouter
    .all('/*', authenticateToken)
    .get('/', paymentController.getPayment)
    .post('/process', paymentController.postPayment)

export {paymentRouter};