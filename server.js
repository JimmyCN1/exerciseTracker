const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const cors = require("cors");

const User = require("./api/models/user");
const Exercise = require("./api/models/exercise");

mongoose.connect(process.env.MLAB_URI, {
  useNewUrlParser: true
});

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Not found middleware
// app.use((req, res, next) => {
//   return next({ status: 404, message: "not found" });
// });

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res
    .status(errCode)
    .type("txt")
    .send(errMessage);
});

app.get("/hello", (req, res) => {
  res.json({ status: res.status(200) });
});

// add new user
app.post("/api/exercise/new-user", (req, res) => {
  console.log(`username: ${req.body.username}`);
  User.findOne({ user: req.body.username }, (err, user) => {
    if (user) {
      res.json("error: username already taken. go back and try again");
    } else if (!user) {
      const user = new User({
        user: req.body.username,
        _id: new mongoose.Types.ObjectId()
      });
      user.save(err => {
        if (err) {
          res.json(err);
        } else {
          res.json(user);
        }
      });
    } else if (err) {
      res.json(err);
    }
  });
});

// post new exercise log
app.post("/api/exercise/add", (req, res) => {
  const { userId, description, duration, date } = req.body;
  console.log(
    `user: ${userId} descrip: ${description} duration: ${duration} date: ${date}`
  );
  const newDate = funcDate => {
    return !funcDate ? new Date() : new Date(funcDate);
  };
  console.log("date: __" + date);
  console.log(newDate(date));
  // console.log(new Date(date));
  User.findOne({ user: userId }, (err, user) => {
    if (user) {
      const exercise = new Exercise({
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        description,
        duration,
        date: newDate(date)
      });
      exercise.save(err => {
        if (err) {
          console.log(err);
          res.json(err);
        } else {
          res.json(exercise);
        }
      });
    } else if (!user) {
      res.json({ error: "there is no user with this username" });
    } else if (err) {
      console.log(err);
      res.json(err);
      // res.json(err);
    }
  });
});

// retrieve logs of users exercises
app.get("/api/exercise/log", (req, res) => {
  const { userId, from, to, limit } = req.query;
  console.log(`${userId} ${from} ${to} ${limit}`);
  console.log(req.query);
  console.log("iso: __" + new Date(from));
  console.log("iso: __" + new Date(to));

  let query = {};

  userId && (query.user = userId);
  (from || to) && (query.date = {});
  from && (query.date.$gte = new Date(from));
  to && (query.date.$lte = new Date(to));
  if (limit) {
    Exercise.find(query)
      .limit(parseInt(limit))
      .exec((err, exercises) => {
        err && console.log(err);
        res.json(exercises);
      });
  } else {
    Exercise.find(query, (err, exercises) => {
      err && console.log(err);
      res.json(exercises);
    });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
