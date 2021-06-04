const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.String,
    required: true,
    default: "User",
  },
});

module.exports = mongoose.model("user", userSchema);
