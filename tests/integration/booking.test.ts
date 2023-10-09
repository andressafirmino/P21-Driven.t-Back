import app, { init } from "@/app";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import httpStatus from "http-status";
import { generateValidTicket } from "./hotels.test";
import { createHotel, createRoom } from "../factories/hotels-factory";
import { prisma } from "@/config";

const api = supertest(app);

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

describe('GET/booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await api.get('/hotels');
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })

    describe('when token is valid and booking dont exist', () => {
        it('should respond with status 404', async () => {
            const token = await generateValidToken();

            const response = await api.get('/booking').set('Authorization', `Bearer ${token}`);

            console.log(response.text)
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
            console.log(response.body)
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
})