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
        test('status:400, responds with bad request message for incorrect path', () => {
            return request(app)
              .get('/not-an-endpoint')
              .expect(400)
              .then(({ body: {msg} }) => {
                expect(msg).toBe('bad request');
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
                // check the articles has the correct properties
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
        test('status:404, responds with Article does not exist message for an id that is not present', () => {
            return request(app)
              .get('/api/articles/99999')          // id is valid but not in table
              .expect(404)
              .then(({ body: {msg} }) => {
                expect(msg).toBe('Article does not exist');
              });
        });
    });

    describe('PATCH /api/articles/:article_id', () => {
      test('status:200, responds with the updated article', () => {
        const articleSelectedId = 1
        const articleUpdate = {inc_votes: -7};
        return request(app)
              .patch(`/api/articles/${articleSelectedId}`)
              .send(articleUpdate)
              .expect(200)
              .then(({ body }) => {
                const { article } = body;    // body contains article so destructure
                expect(article.article_id).toEqual(articleSelectedId);
                expect(article.votes).toEqual(93);                          
              });
      });
      test('status:400, responds with invalid id message if an incorrect id format is used', () => {
          const articleUpdate = {inc_votes: -7};
          return request(app)
                .patch(`/api/articles/not-an-id`)
                .send(articleUpdate)
                .expect(400)
                .then(({ body: {msg} }) => {
                  expect(msg).toBe('invalid id');
                });
      });
      test('status:404, responds with Article does not exist when id not in database', () => {
        const articleUpdate = {inc_votes: -7};
        return request(app)
              .patch(`/api/articles/99999`)
              .send(articleUpdate)
              .expect(404)
              .then(({ body: {msg} }) => {
                expect(msg).toBe('Article does not exist');
              });
      });
    });
  
    describe('GET /api/users', () => {
      test('status:200, responds with an array of users objects', () => {
          return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
              const {userNames} = body;
              expect(userNames).toBeInstanceOf(Array);
          });
      });
      test(`status:200, responds with array of user objects: with property username: string`, () => {
          return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
              const {userNames} = body;
              userNames.forEach((element) => {
                          expect(element).toEqual(
                                  expect.objectContaining({
                                    username: expect.any(String),
                                  })
                          );
                      });
            });
        });

      test('status:200, responds with an array of length 4 users objects from test data', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then(({ body }) => {
            const { userNames } = body;
            expect(userNames).toHaveLength(4);
          });
      });
      test('status:400, responds with bad request message for incorrect path', () => {
        return request(app)
          .get('/api/not-an-endpoint')
          .expect(400)
          .then(({ body: {msg} }) => {
            expect(msg).toBe('bad request');
          });
      });
    });
    
    describe('GET /api/articles', () => {
      test('status:200, responds with an array of 12 article objects for the test data', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          const {articles} = body;
        
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);
        });
      });
      test('status:200, Each object in the articles array has specific properties listed', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          const {articles} = body;
          articles.forEach((article) => {
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
          });
        });
      });
      test('status:200, Articles returned are sorted by date in descending order for test data', () => {

        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
       
          const dateOrder =  ['2020-11-03T09:12:00.000Z',
                              '2020-10-18T01:00:00.000Z',
                              '2020-10-16T05:03:00.000Z',
                              '2020-10-11T11:24:00.000Z',
                              '2020-08-03T13:14:00.000Z',
                              '2020-07-09T20:11:00.000Z',
                              '2020-06-06T09:10:00.000Z',
                              '2020-05-14T04:15:00.000Z',
                              '2020-05-06T01:14:00.000Z',
                              '2020-04-17T01:08:00.000Z',
                              '2020-01-15T22:21:00.000Z',
                              '2020-01-07T14:08:00.000Z'];

          const {articles} = body;
          
          articles.forEach((article, i) => {
            const {created_at} = article;
              expect(created_at).toEqual(dateOrder[i]);
          });
        });
                    

      });
      test('status:400, responds with bad request message for incorrect path', () => {
        return request(app)
          .get('/api/not-an-endpoint')
          .expect(400)
          .then(({ body: {msg} }) => {
            expect(msg).toBe('bad request');
          });
      });
    });

    describe('GET /api/articles/:article_id (comment count)', () => {
         test('status:200, responds with an article object and it contains comment_count', () => {
           return request(app)
             .get('/api/articles/1')
             .expect(200)
             .then(({ body }) => {
               const { article } = body;    // body contains article
                expect(article).toBeInstanceOf(Object);
                expect(article.comment_count).toBe(11);
                   expect(article).toEqual(
                            expect.objectContaining({
                                      author: expect.any(String),
                                      title: expect.any(String),
                                      article_id: expect.any(Number),
                                      body: expect.any(String),
                                      topic: expect.any(String),
                                      created_at: expect.any(String), // should be a date
                                      votes: expect.any(Number),
                                      comment_count: expect.any(Number),
                             })
                     );
           })
       });
       test('status:200, responds with an article object containing comment_count = 11 for article_id = 1', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({ body }) => {
            const { article } = body;    // body contains article
             expect(article.comment_count).toBe(11);
          })
       
        });
        test('status:404, responds with Article does not exist message for out of range id', () => {
          return request(app)
            .get('/api/articles/99999')          // id is valid but not in table
            .expect(404)
            .then(({ body: {msg} }) => {
              expect(msg).toBe('Article does not exist');
            });
        });
        test('status:400, responds with invalid id message found message for bad id', () => {
          return request(app)
            .get('/api/articles/not-an-id')       // id is not valid format
            .expect(400)
            .then(({ body: {msg} }) => {
              expect(msg).toBe('invalid id');
            });
        });
    });

    describe('/GET /api/articles/:article_id/comments', () => {
      test('status:200, responds with an array of comment objects', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            const { commentsList } = body;    // body contains commentsList
             commentsList.forEach((comment) => {
                expect(comment).toEqual(
                         expect.objectContaining({
                                   comment_id: expect.any(Number),
                                   votes: expect.any(Number),
                                   created_at: expect.any(String),
                                   author: expect.any(String),
                                   body: expect.any(String),
                          })
                  );
             });
        })
    });
    test('status:200, responds with an array of 11 comments for article_id = 1', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
          const { commentsList } = body;    // body contains article
           expect(commentsList).toHaveLength(11);
        })
      });

      test('status:200, responds with the 11th comment entry correct for article_id = 1', () => {
        const expectedEntry11 =       {
          comment_id: 18,
          votes: 16,
          created_at: '2020-07-21T00:20:00.000Z',
          author: 'butter_bridge',
          body: 'This morning, I showered for nine minutes.'
        }
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            const { commentsList } = body;    // body contains article
             expect(commentsList[10]).toEqual(expectedEntry11);
          })
       
        });

      test('status:404, responds with Article does not exist message for out of range id', () => {
        return request(app)
          .get('/api/articles/99999/comments')          // id is valid but not in table
          .expect(404)
          .then(({ body: {msg} }) => {
            expect(msg).toBe('Article does not exist');
          });
      });
      test('status:400, responds with invalid id message found message for bad id', () => {
        return request(app)
          .get('/api/articles/not-an-id/comments')       // id is not valid format
          .expect(400)
          .then(({ body: {msg} }) => {
            expect(msg).toBe('invalid id');
          });
      });
    });

    describe('GET /api/articles (comment count)', () => {
       test('status:200, Returns article array. Each object in the articles array includes a comment_count listed', () => {
         return request(app)
         .get('/api/articles')
         
         .expect(200)
         .then(({ body }) => {
           const {articles} = body;

           articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                         author: expect.any(String),
                         title: expect.any(String),
                         article_id: expect.any(Number),
                         body: expect.any(String),
                         topic: expect.any(String),
                         created_at: expect.any(String), // should be a date
                         votes: expect.any(Number),
                         comment_count: expect.any(Number)
               })
            );
          });
         });
      });
      test('status:400, responds with bad request message for incorrect path', () => {
        return request(app)
          .get('/api/not-an-endpoint')
          .expect(400)
          .then(({ body: {msg} }) => {
            expect(msg).toBe('bad request');
          });
      });

    });
    
    describe('POST /api/articles/:article_id/comments, the request accepts a username and a body', () => {
      // This will accept an endpoint of the form  post with /api/articles/4/comments
      test('status:201, responds with item inserted', () => {
        const newCommentObject = {username: 'icellusedkars', 
                                  body: 'Rain beats on my window and the moon lights up the dark'};
        const newCommentObject1 = {username: 'butter_bridge', 
                                  body: 'shadows chasing midnight and the dogs out on the run begin to bark'};

        const expectedReturn = {
                comment_id: 19,
                body: 'Rain beats on my window and the moon lights up the dark',
                article_id: 8,
                author: 'icellusedkars',
                votes: 0
              };
        const expectedReturn1 = {
                comment_id: 20,
                body: 'shadows chasing midnight and the dogs out on the run begin to bark',
                article_id: 8,
                author: 'butter_bridge',
                votes: 0
              };

        return request(app)
         .post('/api/articles/8/comments')
         .send(newCommentObject)
         .expect(201)
         .then(({ body }) => {
              const {new_comment} = body;
              expect(new_comment).toEqual(
                expect.objectContaining(expectedReturn)
              );
              //----------Check we can add another comment about the same article---------
              return request(app)
                      .post('/api/articles/8/comments')
                      .send(newCommentObject1)
                      .expect(201)
                      .then(({ body }) => {
                            const {new_comment} = body;
                            expect(new_comment).toEqual(
                              expect.objectContaining(expectedReturn1)
                            );
                        });
              //-----------------------------------------------------------------------

        });
      });

      test('status:400, responds with No such user message when INVALID username given', () => {
        const newCommentObject = {username: 'NOTAUSER', 
                                  body: 'dark'};

         return request(app)
        .post('/api/articles/5/comments')
        .send(newCommentObject)
        .expect(400)
        .then(({ body: {msg} }) => {
          expect(msg).toBe('Violation (INVALID) username');

        });
      });      
      test('status:404, responds with Article not found when incorrect id given', () => {
        const newCommentObject = {username: 'icellusedkars', 
                                  body: 'Rain beats on my window and the moon lights up the dark'};
        return request(app)
        .post('/api/articles/50/comments')
        .send(newCommentObject)
        .expect(404)
        .then(({ body: {msg} }) => {
          expect(msg).toBe('Article does not exist');
        });
      });      

    });

    describe('GET /api/articles (query)', () => {
      test('status:200, Query containing valid sort_by, order and topic returns array of objects with correct keys including comment_count', () => {
        return request(app)
        .get('/api/articles?sort_by=author&order=ASC&topic=mitch')
        .expect(200)
        .then(({ body }) => {
          const {articles} = body;
          articles.forEach((article) => {
           expect(article).toEqual(
             expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        body: expect.any(String),
                        topic: expect.any(String),
                        created_at: expect.any(String), // should be a date
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
              })
           );
         });
        });
      });
      test('status:200, articles can be selected based on any valid topic=item, e.g topic=cats', () => {
        const expectedReturn =       {
                                article_id: 5,
                                title: 'UNCOVERED: catspiracy to bring down democracy',
                                topic: 'cats',
                                author: 'rogersop',
                                body: 'Bastet walks amongst us, and the cats are taking arms!',
                                created_at: '2020-08-03T13:14:00.000Z',
                                votes: 0,
                                comment_count: 2
                              };
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({ body }) => {
          const {articles} = body;
          articles.forEach((article) => {
           expect(article).toEqual(expectedReturn);
         });
        });
      });
      test('status:200, articles can be sorted by any greenlisted column, eg title with default order (DESC)', () => {
        const expectedReturned_article_id_Order = [7, 5, 9, 4, 2, 10, 12, 1, 3, 8, 11, 6 ];
        return request(app)
               .get('/api/articles?sort_by=title')
               .expect(200)
               .then(({ body }) => {
                 const {articles} = body;
                 articles.forEach((article, i) => {
                  expect(article.article_id).toEqual(expectedReturned_article_id_Order[i]);
                });
               });
      });
      test('status:200, articles can be ordered using order=ASC (DESCending is the default), but with the default sort_by (created_at)', () => {
        const expectedReturned_article_id_Order = [7, 11, 8, 4, 10, 9, 1, 5, 12, 2, 6, 3 ];
        return request(app)
               .get('/api/articles?order=ASC')
               .expect(200)
               .then(({ body }) => {
                const {articles} = body;
   
                articles.forEach((article, i) => {
                 expect(article.article_id).toEqual(expectedReturned_article_id_Order[i]);
               });
              });
      });
      test('status:200, successful selection from test data using order=ASC (DESCending is the default), sort_by (author) with topic=mitch', () => {
        const expectedReturned_article_id_Order = [1, 9, 12, 3, 6, 7, 8, 11, 2, 4, 10 ];
        return request(app)
               .get('/api/articles?sort_by=author&order=ASC&topic=mitch')
               .expect(200)
               .then(({ body }) => {
                const {articles} = body;
  
                articles.forEach((article, i) => {
                 expect(article.article_id).toEqual(expectedReturned_article_id_Order[i]);
               });
          });
      });
      test('status:400, rejects if > 3 distinct keys in the query', () => {
        return request(app)
        .get('/api/articles?sort_by=author&order=DESC&thing=ASC&topic=user')
        .expect(400)
        .then(({ body: {msg} }) => {
          expect(msg).toBe('Too many query keys');
        });
      });
      test('status:400, rejects an invalid key in the query', () => {
        return request(app)
        .get('/api/articles?sort_by=author&INVALID=DESC&topic=user')
        .expect(400)
        .then(({ body: {msg} }) => {
          expect(msg).toBe('Attempt to query on Invalid key');
        });
      });
      test('status:400, rejects for an invalid sort_by query, key is valid but the request is not', () => {
        return request(app)
        .get('/api/articles?sort_by=INVALID&order=DESC&topic=user')
        .expect(400)
        .then(({ body: {msg} }) => {
          expect(msg).toBe('Invalid sort query');
        });
      });
      test('status:400, rejects for an invalid order query', () => {
          return request(app)
            .get('/api/articles?sort_by=author&order=INVALID&topic=user, key is valid but the request is not')
            .expect(400)
            .then(({ body: {msg} }) => {
              expect(msg).toBe('Invalid order query');
            });
      });
      test('status:404, rejects if the query cannot find any results with nothing found', () => {
        return request(app)
               .get('/api/articles?sort_by=author&order=ASC&topic=user')
               .expect(404)
               .then(({ body: {msg} }) => {
                 expect(msg).toBe('No results found for that query');
               });
      });
    });

    describe('DEL /api/comments/:comment_id', () => {

      test('status:204, deletes the current comment based on a valid comment id', () => {
        return request(app)
          .delete('/api/comments/2')
          .expect(204)
          .then(() => {
            // Now check the database after the delete. Article with id 1
            // originally had 11 comments. One of those comments is comment with 
            // comment_id = 2. So after the delete operation of comment_id=2 the
            // length of the comment list for article with id=1 should be 10.
             return request(app)
             
               .get('/api/articles/1/comments')
               .expect(200)
               .then(({ body }) => {
                  const {commentsList} = body;

                  // there were originally 11 entries in the commentsList returned by
                  // get('/api/articles/1/comments') and so after deleting comment with
                  // comment_id = 2 the length of the comments list should be 11 - 1  = 10
                  expect(commentsList.length).toBe(10);
                    commentsList.forEach((comment, i) => {
                                expect(comment.comment_id).not.toBe(2);
                                })
                  // There should not be any entries in the comments table with comment_id=2
                  db.query(`SELECT * FROM comments WHERE comment_id = 2;`)
                  .then(({rows}) => {
                        expect(rows).toEqual([]);
                  });
                 })

        })
      });

      test('status:404, responds with does not exist message for an id that is not present', () => {
        return request(app)
          .delete('/api/comments/99999')          // id is valid but not in table
          .expect(404)
          .then(({ body: {msg} }) => {
            expect(msg).toBe('comment does not exist');
          });
      });

    test('status:404, responds with comment does not exist for -ve id', () => {
        return request(app)
          .delete('/api/comments/-1')       // -ve id is not an id in table
          .expect(404)
          .then(({ body: {msg} }) => {
            expect(msg).toBe('comment does not exist');
          });
    });

    test('status:400, responds with invalid id message found message for bad id', () => {
      return request(app)
        .delete('/api/comments/not-an-id')       // id is not valid format
        .expect(400)
        .then(({ body: {msg} }) => {
          expect(msg).toBe('invalid id');
        });
    });
  });

  describe('GET /api', () => {
    test('status:200, returns the json contained within endpoints.json', () => {
      const expectToContain = ''

      return request(app)
      .get('/api')       
      .expect(200)
      .then(({ body }) => {
      
        // Check that the objects containe in endpoints.json are returned
        expect(body).toEqual(
          expect.objectContaining({"GET /api": expect.any(Object),
                            "GET /api/topics": expect.any(Object),
                            "GET /api/articles/:article_id": expect.any(Object),
                            "GET /api/articles": expect.any(Object),
                            "GET /api/articles/:article_id/comments": expect.any(Object),
                            "POST /api/articles/:article_id/comments": expect.any(Object),
                            "DELETE /api/comments/:comment_id": expect.any(Object),})
                      )
      });
    });
  });
});
