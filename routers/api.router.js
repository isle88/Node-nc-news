const express = require("express");
const topicsRouter = require("./topics.router");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");
const usersRouter = require("./users.router");
const apiRouter = express.Router();
const endpoints = require("../endpoints.json");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.get('/', (req, res, next) => {
  res.status(200).send(endpoints);
});


module.exports = apiRouter;
