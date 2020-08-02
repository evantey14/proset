const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const { Game } = require("./models");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === "production") {
  const buildPath = [__dirname, "..", "frontend", "build"];
  app.use(express.static(path.resolve(...buildPath)));
  app.get("/", (req, res) =>
    res.sendFile(path.resolve(...buildPath, "index.html"))
  );
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Initialize a single game (this should be changed to allow for game creation / tracking)
Game.deleteMany({}, (e) => console.log(e));
Game.createNewGame();

module.exports = app;
