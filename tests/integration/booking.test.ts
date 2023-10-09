import app, { init } from "@/app";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import httpStatus from "http-status";
import { generateValidTicket } from "./hotels.test";
import { createHotel, createRoom } from "../factories/hotels-factory";
import { prisma } from "@/config";
import { createBooking, createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createUser } from "../factories";
import { TicketStatus } from "@prisma/client";

const api = supertest(app);

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

describe('/booking tests', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await api.get('/hotels');
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })

    describe('GET/booking', () => {
        it('should respond with status 404', async () => {
            const token = await generateValidToken();

            const response = await api.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        })

        it('should respond with status 200 and room data', async () => {
            const data = await generateValidTicket();
            const token = await generateValidToken(data.user);
            const hotel = await createHotel();
            const room = await createRoom(hotel.id);
            const userId = data.user.id

            const booking = await prisma.booking.create({
                data: {
                    userId,
                    roomId: room.id
                }
            })

            const response = await api.get('/booking').set('Authorization', `Bearer ${token}`).set('userId', booking.userId.toString());
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toMatchObject({
                id: expect.any(Number),
                Room:
                {
                    id: expect.any(Number),
                    name: expect.any(String),
                    capacity: expect.any(Number),
                    hotelId: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                },
            })
        })
    })
    describe('POST/booking', () => {
        it('should respond with status 401 if no token is given', async () => {
            const response = await api.post('/hotels');
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        })

        it('should respond with status 404 when roomId dont exist', async () => {
            const data = await generateValidTicket();
            const token = await generateValidToken(data.user);

            const response = await api.post(`/booking`).set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
            expect(response.status).toBe(httpStatus.NOT_FOUND);
        })

        it('should respond with status 403 if user ticket is remote', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(true, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel();
            const room = await createRoom(hotel.id);
      
            const response = await api.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
          });
      
          it('should respond with status 403 when ticket doenst include hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, false);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel();
            const room = await createRoom(hotel.id);
      
            const response = await api.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
          });
      
          it('should respond with status 403 when ticket is not paid ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel();
            const room = await createRoom(hotel.id);
      
            const response = await api.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
          });
      
          it('should respond with status 403 when there is no vacancy in the room', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel();
            const room = await createRoom(hotel.id, 0);
      
            const response = await api.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      
            expect(response.status).toBe(httpStatus.FORBIDDEN);
          });

        it('should respond with status 200 when there is no room available', async () => {

            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel();
            const room = await createRoom(hotel.id);

            const response = await api.post(`/booking`).set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual({ bookingId: expect.any(Number) });
        })
    })

    describe('PUT/booking/:bookingId', () => {
        it('should respond with status 401 if no token is given', async () => {
            const response = await api.put('/booking/1');
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        })
        
        it('', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel();
            const room = await createRoom(hotel.id);
            const room2 = await createRoom(hotel.id);
            const booking = await createBooking(user.id, room.id)
            const response = await api.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).set('userId', user.id.toString()).send({ roomId: room2.id });
            
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual({ bookingId: expect.any(Number) });
        })
    })
})