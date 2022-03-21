# BE-NC-NEWS

This project builds API endpoints (such as reddit). Its objective is to simulate the a real backend service that provides information to the front end architecture.


## Stack

- Node 
- PSQL
- Express
- Jest

## APIs
```
GET /api/topics
GET /api/articles/:article_id
PATCH /api/articles/:article_id
GET /api/articles
GET /api/articles/:article_id/comments
POST /api/articles/:article_id/comments
DELETE /api/comments/:comment_id
PATCH /api/comments/:comment_id
GET/ api/users
GET/ api/users/:username
GET /api
```

## Hosted version

https://hyunjungs-nc-news.herokuapp.com/api/


### How to run

- **This project needs minimum version of Node v17.01 & Postgres v12.9**
- Clone the be-nc-news repo `https://github.com/isle88/Node-nc-news.git`
- Run npm i to install the dependencies
- You need to create .env.test & .env.development


### Seeding local database

- npm run seed


### To run tests

- npm run test
