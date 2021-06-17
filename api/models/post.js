const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  image: {
    data: Buffer,
    encoding: String,
    mimetype: String,
    ext: String,
    required: true,
  },
});

module.exports = mongoose.model("post", postSchema);
