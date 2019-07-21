const mongoose = require("mongoose");

const exerciseSchema = mongoose.Schema({
  _id: { type: String, require: true },
  description: { type: String, require: true },
  duration: { type: Number, require: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Exercise", exerciseSchema);
