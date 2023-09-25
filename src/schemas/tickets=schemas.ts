import { PostTicket } from "@/protocols";
import Joi from "joi";


export const postTicketSchema = Joi.object<PostTicket>({
    ticketTypeId: Joi.number().positive().required()
})