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

     describe('GET /api/articles/:article_id', () => {
        test('status:200, responds with an article object and it contains correct properties', () => {
            return request(app)
              .get('/api/articles/2')
              .expect(200)
              .then(({ body }) => {
                const { article } = body;    // body contains article
                expect(article).toBeInstanceOf(Object);
                    expect(article).toEqual(
                             expect.objectContaining({
                                        author: expect.any(String),
                                        title: expect.any(String),
                                        article_id: expect.any(Number),
                                        body: expect.any(String),
                                        topic: expect.any(String),
                                        created_at: expect.any(String), // should be a date
                                        votes: expect.any(Number),
                              })
                     );
            })
            
        });
        test('status:400, responds with invalid id message found message for bad id', () => {
            return request(app)
              .get('/api/articles/not-an-id')       // id is not valid format
              .expect(400)
              .then(({ body: {msg} }) => {
                expect(msg).toBe('invalid id');
              });
        });
        test('status:404, responds with Article does not exist for -ve id', () => {
            return request(app)
              .get('/api/articles/-1')       // -ve id is not an id in table
              .expect(404)
              .then(({ body: {msg} }) => {
                expect(msg).toBe('Article does not exist');
              });
        });
        test('status:404, responds with Article does not exist message for incorrect path', () => {
            return request(app)
              .get('/api/articles/99999')          // id is valid but not in table
              .expect(404)
              .then(({ body: {msg} }) => {
                expect(msg).toBe('Article does not exist');
              });
        });
    });
});
