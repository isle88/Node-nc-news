const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const app = require("../app");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("/api/topics", () => {
  describe("GET", () => {
    test("200: responds with an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body.topics)).toBe(true);
          expect(res.body.topics).toHaveLength(3);
          res.body.topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("200: responds with a single matching article", () => {
      const article_id = 3;
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            body: expect.any(String),
            votes: expect.any(Number),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            comment_count: expect.any(String),
          });
        });
    });
    test("400: responds with an error message when you passed a bad article ID ", () => {
      const article_id = "not-an-id";

      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(`Bad Request`);
        });
    });
    test("404: responds with an error message when you passed article ID that does not exist", () => {
      const article_id = 999;

      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(`Not Found`);
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("200: respond with an array of articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body.articles)).toBe(true);
          expect(res.body.articles).toHaveLength(12);
          expect(res.body.articles).toBeInstanceOf(Array);
          res.body.articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              author: expect.any(String),
              comment_count: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
            });
          });
        });
    });
    test("200: respond with sorted by created date by default", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
            coerce: true,
          });
        });
    });

    test("200: respond with topic by coding", () => {
      return request(app)
        .get("/api/articles?topic=coding")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("coding", {
            descending: true,
            coerce: true,
          });
        });
    });

    test("400: responds with an error message when you passed an invalid sort_by column", () => {
      return request(app)
        .get("/api/articles?sort_by=3333333")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(`Bad Request`);
        });
    });
    test("400: responds with an error message when you passed an invalid order ", () => {
      return request(app)
        .get("/api/articles?order=wrong_order")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(`Bad Request`);
        });
    });

    test("404: responds with an error message when you passed non-existent topic ", () => {
      return request(app)
        .get("/api/articles?topic=bananas")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(`Not Found`);
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("PATCH", () => {
    test("200: patch votes and responds with the updated article", () => {
      const article_id = 3;
      const articleUpdate = { inc_votes: -100 };

      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(articleUpdate)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: -100,
          });
        });
    });

    test("200: patch votes and responds with the updated article (ignore the additional key/value pairs)", () => {
      const article_id = 3;
      const articleUpdate = { inc_votes: 2, name: "Mitch" };

      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(articleUpdate)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 2,
          });
        });
    });

    test("200: if patch data missing 'inc_votes' key, no effect to article", () => {
      const article_id = 3;
      const articleUpdate = { any_key: 1 };

      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(articleUpdate)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            comment_count: "2",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
          });
        });
    });

    test("400: responds with an error message when the update patch passed an invalided value ", () => {
      const article_id = 0;
      const articleUpdate = { inc_votes: "cat" };

      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(articleUpdate)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(`Bad Request`);
        });
    });

    test("400: responds with an error message when the update patch passed an invalided ID ", () => {
      const article_id = "not-an-id";
      const articleUpdate = { inc_votes: 1 };

      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(articleUpdate)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(`Bad Request`);
        });
    });

    test("404: responds with an error message when the update patch passed non existent ID ", () => {
      const article_id = 0;
      const articleUpdate = { inc_votes: 1 };

      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(articleUpdate)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(`Not Found`);
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("200: responds with an array of comments for the given article_id", () => {
      const article_id = 5;

      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([
            {
              comment_id: 14,
              votes: 16,
              created_at: "2020-06-09T05:00:00.000Z",
              author: "icellusedkars",
              body: "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
            },
            {
              comment_id: 15,
              votes: 1,
              created_at: "2020-11-24T00:08:00.000Z",
              author: "butter_bridge",
              body: "I am 100% sure that we're not completely sure.",
            },
          ]);
        });
    });

    test("400: responds with an error message when you passed an invalid ID", () => {
      const article_id = "not-an-id";

      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(`Bad Request`);
        });
    });

    test("404: responds with an error message when you passed non existent ID", () => {
      const article_id = 9999;

      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(`Not Found`);
        });
    });
    test("200: responds with an empty array of comments when you passed valid ID but has no comment", () => {
      const article_id = 12;

      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("POST", () => {
    test("201: create and post comment ", () => {
      const article_id = 1;
      const comment = { username: "lurker", body: "hello" };

      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(comment)
        .expect(201)
        .then((res) => {
          expect(res.body.comment).toBeInstanceOf(Object);
          expect(res.body.comment).toMatchObject({
            comment_id: 19,
            author: "lurker",
            article_id: 1,
            votes: 0,
            created_at: expect.any(String),
            body: "hello",
          });
        });
    });

    test("400: responds with an error message when you passed a invalided ID", () => {
      const article_id = "not-an-id";
      const comment = { username: "lurker", body: "hello" };

      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(comment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(`Bad Request`);
        });
    });

    test("404: responds with an error message when you passed non existent ID", () => {
      const article_id = 999;
      const comment = { username: "lurker", body: "hello" };

      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(comment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(`Not Found`);
        });
    });

    test("400: responds with an error message when username is missing", () => {
      const article_id = 12;
      const comment = { body: "hello" };

      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(comment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(`Bad Request`);
        });
    });

    test("400: responds with an error message when body is missing", () => {
      const article_id = 12;
      const comment = { username: "lurker" };

      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(comment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(`Bad Request`);
        });
    });

    test("404: responds with an error message when username does not exist", () => {
      const article_id = 12;
      const comment = { username: "kim", body: "hello" };

      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(comment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(`Not Found`);
        });
    });

    test("201: create and post comment (ignore the additional key/value pairs)", () => {
      const article_id = 12;
      const comment = { username: "lurker", body: "hello", Like: 3 };

      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(comment)
        .expect(201)
        .then((res) => {
          expect(res.body.comment).toBeInstanceOf(Object);
          expect(res.body.comment).toMatchObject({
            comment_id: 19,
            author: "lurker",
            article_id: 12,
            votes: 0,
            created_at: expect.any(String),
            body: "hello",
          });
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("204: delete comment_id and responds with status 204", () => {
      const comment_id = 1;

      return request(app).delete(`/api/comments/${comment_id}`).expect(204);
    });

    test("404: responds with an error message when you passed comment_id that does not exist", () => {
      const comment_Id = 9999;

      return request(app)
        .delete(`/api/comments/${comment_Id}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(`Not found`);
        });
    });

    test("400: responds with an error message when you passed an invalid ID", () => {
      const comment_Id = "not-an-id";

      return request(app)
        .delete(`/api/comments/${comment_Id}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(`Bad Request`);
        });
    });
  });
});

describe("/api", () => {
  describe("GET", () => {
    test("200: respond with endpoints.json", () => {
      return request(app)
        .get(`/api`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            "DELETE /api/comments/:comment_id": {
              description: "delete comments by comment_id",
              exampleResponse: { msg: "Not found" },
              queries: [],
            },
            "GET /api": {
              description:
                "serves up a json representation of all the available endpoints of the api",
            },
            "GET /api/articles": {
              description:
                "serves an array of all articles sort_by created_at, order DESC and topic coding",
              exampleResponse: {
                "articles": [
                  {
                    "author": "tickle122",
                    "title": "The battle for Node.js security has only begun",
                    "article_id": 12,
                    "topic": "coding",
                    "created_at": "2020-11-15T13:25:00.000Z",
                    "votes": 0,
                    "comment_count": "7"
                  },
                  {
                    "author": "grumpy19",
                    "title": "JavaScript’s Apply, Call, and Bind Methods are Essential for JavaScript Professionals",
                    "article_id": 6,
                    "topic": "coding",
                    "created_at": "2020-11-11T15:09:00.000Z",
                    "votes": 0,
                    "comment_count": "11"
                  },
                  {
                    "author": "jessjelly",
                    "title": "Running a Node App",
                    "article_id": 1,
                    "topic": "coding",
                    "created_at": "2020-11-07T06:03:00.000Z",
                    "votes": 0,
                    "comment_count": "8"
                  },
                  {
                    "author": "tickle122",
                    "title": "Using React Native: One Year Later",
                    "article_id": 7,
                    "topic": "coding",
                    "created_at": "2020-10-18T00:26:00.000Z",
                    "votes": 0,
                    "comment_count": "8"
                  },
                  {
                    "author": "cooljmessy",
                    "title": "Express.js: A Server-Side JavaScript Framework",
                    "article_id": 8,
                    "topic": "coding",
                    "created_at": "2020-10-05T22:23:00.000Z",
                    "votes": 0,
                    "comment_count": "7"
                  },
                  {
                    "author": "jessjelly",
                    "title": "Making sense of Redux",
                    "article_id": 4,
                    "topic": "coding",
                    "created_at": "2020-09-11T20:12:00.000Z",
                    "votes": 0,
                    "comment_count": "9"
                  },
                  {
                    "author": "tickle122",
                    "title": "Designing Better JavaScript APIs",
                    "article_id": 11,
                    "topic": "coding",
                    "created_at": "2020-07-06T23:13:00.000Z",
                    "votes": 0,
                    "comment_count": "5"
                  },
                  {
                    "author": "cooljmessy",
                    "title": "An Introduction to JavaScript Object Notation (JSON) in JavaScript and .NET",
                    "article_id": 10,
                    "topic": "coding",
                    "created_at": "2020-07-02T11:23:00.000Z",
                    "votes": 0,
                    "comment_count": "8"
                  },
                  {
                    "author": "grumpy19",
                    "title": "Learn HTML5, CSS3, and Responsive WebSite Design in One Go",
                    "article_id": 9,
                    "topic": "coding",
                    "created_at": "2020-05-26T14:06:00.000Z",
                    "votes": 0,
                    "comment_count": "8"
                  },
                  {
                    "author": "jessjelly",
                    "title": "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
                    "article_id": 2,
                    "topic": "coding",
                    "created_at": "2020-05-14T00:02:00.000Z",
                    "votes": 0,
                    "comment_count": "6"
                  },
                  {
                    "author": "jessjelly",
                    "title": "Please stop worrying about Angular 3",
                    "article_id": 5,
                    "topic": "coding",
                    "created_at": "2020-04-21T16:06:00.000Z",
                    "votes": 1,
                    "comment_count": "6"
                  },
                  {
                    "author": "happyamy2016",
                    "title": "22 Amazing open source React projects",
                    "article_id": 3,
                    "topic": "coding",
                    "created_at": "2020-02-29T11:12:00.000Z",
                    "votes": 4,
                    "comment_count": "10"
                  }
                ]
              },
              queries: ["sort_by", "order", "topic"],
            },

            "GET /api/articles/:article_id": {
              description: "serves an array of article by article_id",
              exampleResponse: {
                article: {
                  article_id: 1,
                  author: "jessjelly",
                  body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
                  comment_count: "8",
                  created_at: "2020-11-07T06:03:00.000Z",
                  title: "Running a Node App",
                  topic: "coding",
                  votes: 0,
                },
              },
              queries: [],
            },
            "GET /api/articles/:article_id/comments": {
              description: "serves an array of comment by article_id",
              exampleResponse: {
                article: {
                  comments: [
                    {
                      author: "weegembump",
                      body: "Sit sequi odio suscipit. Iure quisquam qui alias distinctio eos officia enim aut sit. Corrupti ut praesentium ut iste earum itaque qui. Dolores in ab rerum consequuntur. Id ab aliquid autem dolore.",
                      comment_id: 31,
                      created_at: "2020-09-26T16:16:00.000Z",
                      votes: 11,
                    },
                    {
                      author: "cooljmessy",
                      body: "Explicabo perspiciatis voluptatem sunt tenetur maxime aut. Optio totam modi. Perspiciatis et quia.",
                      comment_id: 33,
                      created_at: "2019-12-31T21:21:00.000Z",
                      votes: 4,
                    },
                    {
                      author: "grumpy19",
                      body: "Error est qui id corrupti et quod enim accusantium minus. Deleniti quae ea magni officiis et qui suscipit non.",
                      comment_id: 44,
                      created_at: "2020-06-15T15:13:00.000Z",
                      votes: 4,
                    },
                  ],
                },
              },
              queries: [],
            },
            "GET /api/topics": {
              description: "serves an array of all topics",
              exampleResponse: {
                topics: [{ description: "Footie!", slug: "football" }],
              },
              queries: [],
            },
            "PATCH /api/articles/:article_id": {
              description:
                "patch votes and serves an array of article by article_id",
              exampleResponse: {
                article: {
                  article_id: 1,
                  author: "jessjelly",
                  body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
                  created_at: "2020-11-07T06:03:00.000Z",
                  title: "Running a Node App",
                  topic: "coding",
                  votes: 2,
                },
              },
              queries: [],
            },
            "POST /api/articles/:article_id/comments": {
              description: "post an object and serves an array of comment",
              exampleResponse: {
                comment: {
                  article_id: 1,
                  author: "lurker",
                  body: "hello",
                  comment_id: 19,
                  created_at: "2022-02-06T21:17:18.122Z",
                  votes: 0,
                },
              },
              queries: [],
            },

            "GET /api/users": {
              description: "serves an array of all usernames",
              exampleResponse: {
                users: [{ username: "tickle122" }],
              },
              queries: [],
            },

            "GET /api/users/:username": {
              description: "serves an array of user by username",
              exampleResponse: {
                username: [
                  {
                    username: "tickle122",
                    avatar_url:
                      "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
                    name: "Tom Tickle",
                  },
                ],
              },
              queries: [],
            },

            "PATCH /api/comments/:comment_id": {
              description:
                "patch votes and serves an array of comments by comment_id",
              queries: [],
              exampleResponse: {
                comment: [
                  {
                    comment_id: 20,
                    author: "happyamy2016",
                    article_id: 13,
                    votes: 1,
                    created_at: "2020-04-07T04:19:00.000Z",
                    body: "Libero explicabo aperiam esse quae. Dolores in ipsum vitae incidunt. Magnam ullam nihil voluptas enim veritatis et nobis architecto.",
                  },
                ],
              },
            },
          });
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("200: responds with an array of users ", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body.users)).toBe(true);
          expect(res.body.users).toHaveLength(4);
          res.body.users.forEach((topic) => {
            expect(topic).toMatchObject({
              username: expect.any(String),
            });
          });
        });
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    test("200: responds with an array of username ", () => {
      const username = "lurker";

      return request(app)
        .get(`/api/users/${username}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.username).toMatchObject({
            username: expect.any(String),
            avatar_url: expect.any(String),
            name: expect.any(String),
          });
        });
    });

    test("200: responds with an array of username ", () => {
      const username = "lurker";

      return request(app)
        .get(`/api/users/${username}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.username).toEqual({
            username: "lurker",
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            name: "do_nothing",
          });
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("PATCH", () => {
    test("200: patch votes and responds with the updated comment", () => {
      const comment_id = 5;
      const commentUpdate = { inc_votes: -100 };

      return request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(commentUpdate)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: 5,
            author: "icellusedkars",
            article_id: 1,
            votes: -100,
            created_at: "2020-11-03T21:00:00.000Z",
            body: "I hate streaming noses",
          });
        });
    });

    test("200: patch votes and responds with the updated article (ignore the additional key/value pairs)", () => {
      const comment_id = 5;
      const commentUpdate = { inc_votes: 1, name: "Mitch" };

      return request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(commentUpdate)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: 5,
            author: "icellusedkars",
            article_id: 1,
            votes: 1,
            created_at: "2020-11-03T21:00:00.000Z",
            body: "I hate streaming noses",
          });
        });
    });
  });
});
