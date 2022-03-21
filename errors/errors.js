exports.handleCustomErr = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handle404Err = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: `Not Found` });
  } else next(err);
};

exports.handle400Err = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: `Bad Request` });
  } else next(err);
};

exports.handleServerErr = (err, req, res) => {
  res.status(500).send({ msg: `Internal Server Error` })
};
