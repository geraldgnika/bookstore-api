const request = require('supertest');
const axios = require('axios');
const app = require('./index.js');

jest.mock('axios');

describe('User service', () => {
    test('GET /users returns array', async () => {
        const res = await request(app).get('/users');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /users/:id returns the user, or 404', async () => {
        const ok = await request(app).get('/users/1');
        expect(ok.status).toBe(200);
        expect(ok.body).toHaveProperty('id', "1");

        const notFound = await request(app).get('/users/9999');
        expect(notFound.status).toBe(404);
    });

    test('POST /users/export returns CSV text', async () => {
        axios.get.mockResolvedValue({
            data: [
                {
                    id: "1",
                    name: "The Interpretation of Dreams",
                    author: "Sigmund Freud",
                    totalPages: 700
                },
                {
                    id: "2",
                    name: "On the Genealogy of Morality",
                    author: "Friedrich Nietzsche",
                    totalPages: 250
                }
            ]
        });

        const res = await request(app).post('/users/export').send();
        expect(res.status).toBe(200);
        expect(res.header['content-type']).toMatch(/text\/csv/);

        const separators = res.text.split('\n');
        expect(separators[0]).toBe('User Id|First Name|Last Name|Date|Book|Pages Read');
        expect(separators.length).toBeGreaterThan(1);
    });
});