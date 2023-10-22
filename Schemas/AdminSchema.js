const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    default: "Admin", // Set the default value to "Admin"
  },
  password: {
    type: String,
    required: true,
    default: "Admin", // Set the default value to "Admin"
  },
});

module.exports = mongoose.model("Admin", adminSchema);
