const db = require("../db/connection");

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rowCount }) => {
      if (!rowCount) {
        return Promise.reject({ status: 404, msg: `Not found` });
      }
    });
};

exports.updateCommentVotes = (comment_id, commentUpdate) => {
  const { inc_votes: newVote } = commentUpdate;

  if (commentUpdate.hasOwnProperty("inc_votes")) {
    return db
      .query(
        `UPDATE comments SET votes = votes+$2 WHERE comment_id = $1 RETURNING *;`,
        [comment_id, newVote]
      )
      .then(({ rows }) => {
        if (!rows.length) return Promise.reject({ status: 404, msg: `Not Found` });
        if (typeof rows[0].votes !== "number" ||
        typeof rows[0].comment_id !== "number") {
          return Promise.reject({ status: 400, msg: `Bad Request` });
        } else {
          return rows[0];
        }
      });
  }
};
