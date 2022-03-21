const { selectUsers, selectUsername } = require('../models/users.model')

exports.getUsers =(req, res, next) => {
  selectUsers()
  .then((users) => {
      return res.status(200).send(({ users }))
  })
  .catch(next);
}

exports.getUsername = (req, res, next) => {
  const { username } = req.params
    selectUsername(username)
    .then((username) => {
        return res.status(200).send(({ username }))
    })
    .catch(next)
}