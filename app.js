const express = require("express");
const app = express();
const cors = require("cors");
const apiRouter = require("./routers/api.router");
const {
  handle404Err,
  handle400Err,
  handleCustomErr,
  handleServerErr,
} = require("./errors/errors");

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.use(handleCustomErr);
app.use(handle400Err);
app.use(handle404Err);
app.use(handleServerErr);

app.listen(9090)
module.exports = app;
