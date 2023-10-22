const mongoose = require("mongoose");
const transactionSchema = mongoose.Schema({
  perior: {
    type: String, //0x000 => Bank || 01234 => account no
    required: true,
  },
  transType: {
    type: String, //Deposit || withdraw
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dateTime: {
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  accountNo: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Transaction", transactionSchema);
