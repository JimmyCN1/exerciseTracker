const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  user: String,
  _id: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model("User", userSchema);
