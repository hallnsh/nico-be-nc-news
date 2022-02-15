const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const db = require('../db/connection');

afterAll(() => {
    db.end();
  });

beforeEach(() => seed(data));

describe('app()', () => {
     describe('GET /api/topics', () => {
        test('status:200, responds with an array of topic objects', () => {
            return request(app)
              .get('/api/topics')
              .expect(200)
              .then(({ body }) => {
                const { topics } = body;
                expect(topics).toBeInstanceOf(Array);
            });
        });
        test(`status:200, responds with array of topic objects: properites 
                slug: string, description: string`, () => {
            return request(app)
              .get('/api/topics')
              .expect(200)
              .then(({ body }) => {
                const { topics } = body;
                topics.forEach((topic) => {
                            expect(topic).toEqual(
                                    expect.objectContaining({
                                        slug: expect.any(String),
                                        description: expect.any(String),
                                    })
                            );
                        });
              });
        });
        test('status:200, responds with an array of length 3 topic objects', () => {
            return request(app)
              .get('/api/topics')
              .expect(200)
              .then(({ body }) => {
                const { topics } = body;
                expect(topics).toHaveLength(3);
              });
        });
        test('status:404, responds with path not found message for incorrect path', () => {
            return request(app)
              .get('/not-an-endpoint')
              .expect(404)
              .then(({ body: {msg} }) => {
                expect(msg).toBe('path not found');
              });
        });
     });
});


