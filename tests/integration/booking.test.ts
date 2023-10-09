import app, { init } from "@/app";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import httpStatus from "http-status";

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

        it ('should respond with status 200', async () => {
            
        })
    })
})