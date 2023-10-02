import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response ) {
    const userId = req.userId;
    const hotels = await hotelsService.getHotels(userId);
    res.status(httpStatus.OK).send(hotels);
}

export async function getHotelId(req: AuthenticatedRequest, res: Response ) {
    const userId = req.userId;
    const {hotelId} = req.params;

    const hotel = await hotelsService.getHotelId(userId, hotelId);
    res.status(httpStatus.OK).send(hotel);
}