const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
//db connection
global.ObjectId = require("mongoose").Types.ObjectId;
global.mongoose = require("mongoose");
require("./db/index").configure(mongoose);
// require("./services/cron.service")

//Routers
const indexRouter = require("./routes/index");

const app = express();

app.use(cors());
logger.token('body', (req) => JSON.stringify(req.body));
app.use(logger(':method :url :status :response-time ms :date[web] - :body'));
app.use(express.json({ limit: '2480mb' }));
app.use(express.urlencoded({ extended: true, limit: '2480mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));



app.use("/", indexRouter);

const data = app.use("**", (req, res) => {
  res.status(404).json({ success: false, message: "Invalid router" });
});

global.badReqErr = (err) => {
  err.statusCode = 400
  return err
};

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log("err", err);

  let message = err.message ? err.message : err;

  if (err.name === "ValidationError") {
    err.statusCode = 400;
    message = err?.details[0]?.message || "Validation Error";
  }
  if (err.name === "TokenExpiredError") {
    err.statusCode = 401;
    // message = "Link expired. Please generate a new one.";
    message = "Token Expired";
  }

  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    message = "SignIn Again";
  }

  if (err.name === "RestException") {
    return res.status(err.statusCode || 400).json({
      status: err.status,
      message: message,
    });
  }

  res.status(err.statusCode).json({
    status: "error",
    message: message,
  });
});


// generateModelsFromJson();
module.exports = app;
