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

app.post("/api/exercise/add", (req, res) => {
  const { userId, description, duration, date } = req.body;
  console.log(
    `user: ${userId} descrip: ${description} duration: ${duration} date: ${date}`
  );
  res.send(
    `user: ${userId} descrip: ${description} duration: ${duration} date: ${date}`
  );
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
