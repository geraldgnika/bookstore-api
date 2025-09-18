const request = require('supertest');
const app = require('./index');

describe('Book service', () => {
    test('GET /books returns array', async () => {
        const res = await request(app).get('/books');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /books/:id returns the book, or 404', async () => {
        const ok = await request(app).get('/books/1');
        expect(ok.status).toBe(200);
        expect(ok.body).toHaveProperty('id', "1");

        const notFound = await request(app).get('/books/9999');
        expect(notFound.status).toBe(404);
    });
});