const mongoose = require("mongoose");

const userDetailSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  sekolah: {
    type: String,
    default: ""
  },
  telepon: {
    type: String,
    default: ""
  },
  mapel: {
    type: String,
    default: ""
  },
});

module.exports = mongoose.model("userDetail", userDetailSchema);
