import app, { init } from "@/app";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import httpStatus from "http-status";
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from "../factories";
import { TicketStatus, User } from "@prisma/client";
import { createHotel, createRoom } from "../factories/hotels-factory";

const api = supertest(app);

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

describe('GET/hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await api.get('/hotels');
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid and ticket is invalid', () => {
        it('should respond with status 404 if ticket dont exist', async () => {
          const token = await generateValidToken();
    
          const response = await api.get(`/hotels`).set('Authorization', `Bearer ${token}`);
    
          expect(response.status).toBe(httpStatus.NOT_FOUND);
        });
    
        it('should respond with status 402 if invalid ticket', async () => {
          const randomTicketFunction =
            ticketGenerationFunctions[Math.floor(Math.random() * ticketGenerationFunctions.length)];
          const user = await randomTicketFunction();
          const token = await generateValidToken(user);
    
          const response = await api.get(`/hotels`).set('Authorization', `Bearer ${token}`);
    
          expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });
      });
      describe('when token and ticket are valid', () => {
        it('should respond with status 404 when there are no hotels created', async () => {
          const data = await generateValidTicket();
          const token = await generateValidToken(data.user);
    
          const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);
    
          expect(response.status).toBe(httpStatus.NOT_FOUND);
        });
    
        it('should respond with status 201 and with hotel data', async () => {
          const data = await generateValidTicket();
          const token = await generateValidToken(data.user);
    
          const hotel = await createHotel();
    
          const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);
    
          console.log(response.body)
          expect(response.body).toEqual([
            {
              id: hotel.id,
              name: hotel.name,
              image: hotel.image,
              createdAt: hotel.createdAt.toISOString(),
              updatedAt: hotel.updatedAt.toISOString(),
            },
          ]);
          expect(response.status).toBe(httpStatus.OK);
        });
      });
    });
    
    describe('GET /hotels/:hotelId', () => {
      it('should respond with status 401 if no token is given', async () => {
        const hotelId = 1;
        const response = await api.get(`/hotels/${hotelId}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      describe('when token is valid and ticket is invalid', () => {
        it('should respond with status 404 if ticket dont exist', async () => {
          const hotelId = 1;
          const token = await generateValidToken();
    
          const response = await api.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);
    
          expect(response.status).toBe(httpStatus.NOT_FOUND);
        });
    
        it('should respond with status 402 if invalid ticket', async () => {
          const randomTicketFunction =
            ticketGenerationFunctions[Math.floor(Math.random() * ticketGenerationFunctions.length)];
          const user = await randomTicketFunction();
          const token = await generateValidToken(user);
          const hotelId = 0;
    
          const response = await api.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);
    
          expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });
      });
    
      describe('when token and ticket are valid', () => {
        it('should respond with status 400 if id not number', async () => {
          const data = await generateValidTicket();
          const token = await generateValidToken(data.user);
          const hotelId = 'id';
    
          const response = await api.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);
    
          expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });
    
        it('should respond with status 404 if id dont exist', async () => {
          const data = await generateValidTicket();
          const token = await generateValidToken(data.user);
    
          const hotelId = 0;
    
          const response = await api.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);
    
          expect(response.status).toBe(httpStatus.NOT_FOUND);
        });
    
        it('should respond with status 201 and with hotel data', async () => {
          const data = await generateValidTicket();
          const token = await generateValidToken(data.user);
    
          const hotel = await createHotel();
          const room = await createRoom(hotel.id);
          const hotelId = hotel.id;
    
          const response = await api.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);
    
          expect(response.body).toEqual({
            id: hotel.id,
            name: hotel.name,
            image: hotel.image,
            createdAt: hotel.createdAt.toISOString(),
            updatedAt: hotel.updatedAt.toISOString(),
            Rooms: [
              {
                id: room.id,
                name: room.name,
                capacity: room.capacity,
                hotelId: room.hotelId,
                createdAt: room.createdAt.toISOString(),
                updatedAt: room.updatedAt.toISOString(),
              },
            ],
          });
          expect(response.status).toBe(httpStatus.OK);
    
          expect(response.body.Rooms).not.toBeNull();
        });
      });
})


async function generateTicketRESERVED(): Promise<User> {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
  
    return user;
  }
  
  async function generateTicketNotIncludeHotel(): Promise<User> {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, false);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
  
    return user;
  }
  
  async function generateTicketRemote(): Promise<User> {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true, true);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
  
    return user;
  }
  
  const ticketGenerationFunctions = [generateTicketRESERVED, generateTicketNotIncludeHotel, generateTicketRemote];
  
  async function generateValidTicket() {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
  
    return { user, ticket, ticketType };
  }