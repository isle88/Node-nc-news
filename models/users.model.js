const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query(`SELECT username FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.selectUsername = (username) => {
  return db
  .query(`SELECT * FROM users WHERE username = $1;`, [username])
  .then(({ rows }) => {
      return rows[0]
  });
};
