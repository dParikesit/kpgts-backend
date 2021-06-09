const mongoose = require("mongoose");

const userDetailSchema = new mongoose.Schema({
  email: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  nama: {
    type: String,
    required: true,
  },
  sekolah: {
    type: mongoose.Schema.Types.String,
  },
  telepon: {
    type: mongoose.Schema.Types.String,
  },
  mapel: {
    type: mongoose.Schema.Types.String,
  },
});

module.exports = mongoose.model("userDetail", userDetailSchema);
