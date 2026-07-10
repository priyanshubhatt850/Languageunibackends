const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { AppError } = require("./utils/AppError");
//db connection
global.ObjectId = require("mongoose").Types.ObjectId;
global.mongoose = require("mongoose");
require("./db/index").configure(mongoose);
// require("./services/cron.service")

//Routers
const indexRouter = require("./routes/index");

const app = express();

app.use(cors());
app.use(helmet());
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

app.use((err, req, res, next) => {
  console.error("err", err);

  if (err instanceof AppError) {
    const response = { success: false, status: err.status, message: err.message };
    if (process.env.NODE_ENV === "development") response.stack = err.stack;
    return res.status(err.statusCode).json(response);
  }

  if (err.name === "ValidationError" && err.errors) {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, status: "fail", message: messages.join(", ") });
  }

  if (err.name === "ValidationError") {
    const message = err?.details?.[0]?.message || "Validation Error";
    return res.status(400).json({ success: false, status: "fail", message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ success: false, status: "fail", message: `Invalid ${err.path}: ${err.value}` });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    return res.status(409).json({ success: false, status: "fail", message: `Duplicate value for: ${field}` });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, status: "fail", message: "Token Expired" });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, status: "fail", message: "SignIn Again" });
  }

  const statusCode = err.statusCode || 500;
  const response = { success: false, status: "error", message: err.message || "Something went wrong" };
  if (process.env.NODE_ENV === "development") response.stack = err.stack;
  return res.status(statusCode).json(response);
});

module.exports = app;
