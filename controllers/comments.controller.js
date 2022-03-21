const {
  removeCommentById,
  updateCommentVotes,
} = require("../models/comments.model");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then(() => res.status(204).end())
    .catch(next);
};

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;

  updateCommentVotes(comment_id, req.body)
    .then((comment) => {
      return res.status(200).send({ comment });
    })
    .catch(next);
};
