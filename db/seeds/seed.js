const db = require("../connection.js");
const format = require("pg-format");
const { formatTopics } = require("../../utils/utils-seeding");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  return db
    .query(`DROP TABLE IF EXISTS topics,users,articles,comments`)
    .then(() => {
      return db.query(`CREATE TABLE topics (
          slug VARCHAR(255) PRIMARY KEY,
          description VARCHAR(255) NOT NULL
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
          username TEXT PRIMARY KEY,
          avatar_url VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          body TEXT NOT NULL,
          votes INT DEFAULT 0 NOT NULL,
          topic VARCHAR(255) REFERENCES topics(slug) NOT NULL,
          author VARCHAR(255) REFERENCES users(username) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          author VARCHAR(255) REFERENCES users(username) NOT NULL,
          article_id INT REFERENCES articles(article_id) NOT NULL,
          votes INT DEFAULT 0 NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          body TEXT NOT NULL
        );`);
    })
    .then(() => {
      const sql = format(
        `INSERT INTO topics (slug, description)
        VALUES %L RETURNING *;`,
        formatTopics(topicData)
      );
      return db.query(sql);
    })
    .then(() => {
      const formattedUsers = userData.map((user) => [
        user.username,
        user.avatar_url,
        user.name,
      ]);
      const sql = format(
        `INSERT INTO users (username, avatar_url, name) VALUES %L RETURNING *;`,
        formattedUsers
      );
      return db.query(sql);
    })
    .then(() => {
      const formattedArticles = articleData.map((article) => [
        article.title,
        article.body,
        article.votes,
        article.topic,
        article.author,
        article.created_at,
      ]);
      const sql = format(
        `INSERT INTO articles (title, body, votes, topic, author, created_at) VALUES %L RETURNING *;`,
        formattedArticles
      );
      return db.query(sql);
    })
    .then(() => {
      const formattedComments = commentData.map((comment) => [
        comment.author,
        comment.article_id,
        comment.votes,
        comment.created_at,
        comment.body,
      ]);
      const sql = format(
        `INSERT INTO comments (author, article_id, votes, created_at, body) VALUES %L RETURNING *;`,
        formattedComments
      );
      return db.query(sql);
    });
};

module.exports = seed;
