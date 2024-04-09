require("dotenv").config();
const express = require("express");
const compression = require("compression");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

//init midlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
//init db
require("./dbs/init.mogodb");
//init routes

app.use("/", require("./routes/index.routes"));

app.use((req, res, next) => {
  const error = new Error("not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    // stack: err.stack,
    message: err.message || "Internal Server",
  });
});
// const { countConnect } = require("./helpers/check.connect");
// countConnect();

//....
//handling error
module.exports = app;
