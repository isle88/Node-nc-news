const db = require("../db/connection");
const { checkArticleId } = require("../utils/utils");

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) 
    AS comment_count FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: `Not Found`,
        });
      }
      return rows[0];
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return checkArticleId(article_id).then((id) => {
    if (id) {
      return db
        .query(
          `SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id= $1`,
          [article_id]
        )
        .then(({ rows }) => {
          return rows;
        });
    }
    return Promise.reject({ status: 404, msg: `Not Found` });
  });
};

exports.updateArticleVotes = (article_id, articleUpdate) => {
  const { inc_votes: newVote } = articleUpdate;

  if (articleUpdate.hasOwnProperty("inc_votes")) {
    return db
      .query(
        `UPDATE articles SET votes = votes+$2 WHERE article_id = $1 RETURNING *;`,
        [article_id, newVote]
      )
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({ status: 404, msg: `Not Found` });
        } else if (
          typeof rows[0].votes !== "number" ||
          typeof rows[0].article_id !== "number"
        ) {
          return Promise.reject({ status: 400, msg: `Bad Request` });
        } else {
          return rows[0];
        }
      });
  } else {
    return this.selectArticleById(article_id);
  }
};

exports.selectArticles = (query) => {
  const { sort_by = "created_at", order = "DESC", topic } = query;
  const topics = ['coding', 'football', 'cooking'];
  const orderBy = ["DESC", "ASC", "desc", "asc"];
  const sortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];

  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,
  COUNT(comments.article_id) AS comment_count 
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id`;

  const queryValues = [];

  if (!sortBy.includes(sort_by)) return Promise.reject({ status: 400, msg: `Bad Request` });
  if (!orderBy.includes(order)) return Promise.reject({ status: 400, msg: `Bad Request` });
  if (!topics.includes(topic) && topic) return Promise.reject({ status: 404, msg: `Not Found` });

   if (!topic) {
     queryStr += ` GROUP BY articles.article_id`
     queryStr += ` ORDER BY ${sort_by} ${order};`;

    return db
    .query(queryStr)
    .then(({ rows }) => {
      return rows;
    });
   } else {
    queryValues.push(topic);
    queryStr += ` WHERE topic=$1`;
    queryStr += ` GROUP BY articles.article_id`
    queryStr += ` ORDER BY ${sort_by} ${order};`
    
    return db
    .query(queryStr, queryValues)
    .then(({ rows }) => {
      return rows;
   })
  }
}

exports.insertComment = (article_id, comment) => {
  const { username, body } = comment;

  if (!(comment.body && comment.username)) {
    return Promise.reject({ status: 400, msg: `Bad Request` });
  }

  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, body, (article_id = `${article_id}`)]
    )
    .then((res) => {
      return res.rows[0];
    });
};