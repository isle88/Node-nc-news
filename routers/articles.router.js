const express = require("express");
const {
  getArticles,
  getArticleById,
  patchArticleVotes,
  getCommentByArticleId,
  postComment,
} = require("../controllers/articles.controller");

const articlesRouter = express.Router();

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentByArticleId)
  .post(postComment);

module.exports = articlesRouter;
