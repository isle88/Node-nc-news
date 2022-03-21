const express = require("express");
const {
  deleteCommentById,
  patchCommentVotes,
} = require("../controllers/comments.controller");

const commentsRouter = express.Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentVotes);

module.exports = commentsRouter;
