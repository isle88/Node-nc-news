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

https://hyunjung-kim.cyclic.app/api


### How to run

- **This project needs minimum version of Node v17.01 & Postgres v12.9**
- Clone the be-nc-news repo `https://github.com/isle88/node-nc-news.git`
- Run npm i to install the dependencies
- You need to create .env files
```
.env.test =>  PGDATABASE=nc_news_test
.env.development =>  PGDATABASE=nc_news
```


### Seeding local database

- Open PSQL on your terminal
- Enter this script to drop and create on your local database
```
    DROP DATABASE IF EXISTS nc_news_test;
    DROP DATABASE IF EXISTS nc_news;

    CREATE DATABASE nc_news_test;
    CREATE DATABASE nc_news;
```


### To run tests

- npm test
- npm test app / npm test utils
