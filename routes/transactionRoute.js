const express = require("express");
const router = express.Router();
const transactionSchema = require("../Schemas/TransactionSchema"); // Import your transaction schema
const {
  depositAmount,
  withdrawAmount,
  transferAmount,
} = require("../extras/transHelper");

router.get("/get/:accNo", async (req, res) => {
  const accountNo = req.params.accNo;

  try {
    const transactions = await transactionSchema.find({ accountNo });

    if (!transactions) {
      return res.status(404).json({ error: "No transactions found" });
    }

    return res.status(200).json(transactions);
  } catch (err) {
    return res.status(500).json({
      error: "Error while fetching transactions",
      message: err.message,
    });
  }
});

router.post("/deposit", async (req, res) => {
  const { amount, accountNo } = req.body;
  try {
    depositAmount(accountNo, amount);
  } catch (error) {
    return res.status(500).send(error);
  }
  const newTransaction = new transactionSchema({
    perior: "0000",
    transType: "DEPOSIT",
    amount: amount,
    "dateTime.date": new Date().toLocaleDateString(),
    "dateTime.time": new Date().toLocaleTimeString(),
    accountNo: accountNo,
  });

  try {
    const savedTransaction = await newTransaction.save();
    return res.send(savedTransaction);
  } catch (err) {
    return res
      .status(500)
      .send("Error while saving transaction: " + err.message);
  }
});

router.post("/withdraw", async (req, res) => {
  const { perior, transType, amount, accountNo } = req.body;
  try {
    withdrawAmount(accountNo, amount);
    // if(balance<amount){
    //   return res.status(200).send("Failed to withdraw: Insufficient balance");
    // }
  } catch (error) {
    return res.status(500).send(error);
  }
  const newTransaction = new transactionSchema({
    perior:  "0000",
    transType: "WITHDRAW",
    amount: amount,
    "dateTime.date": new Date().toLocaleDateString(),
    "dateTime.time": new Date().toLocaleTimeString(),
    accountNo: accountNo,
  });

  try {
    const savedTransaction = await newTransaction.save();
    return res.send(savedTransaction);
  } catch (err) {
    return res
      .status(500)
      .send("Error while saving transaction: " + err.message);
  }
});

router.post("/transfer", async (req, res) => {
  const { senderAccountNo, receiverAccountNo, amount } = req.body;

  try {
    // Attempt the transfer
    const transferResult = await transferAmount(
      senderAccountNo,
      receiverAccountNo,
      amount
    );
    if (!transferResult) {
      return res.status(400).send("Failed to transfer.");
    }

    // Create two transactions for withdrawal and deposit
    const withdrawalTransaction = new transactionSchema({
      perior: senderAccountNo,
      transType: "TRANSFER",
      amount: -amount, // Withdraw from sender
      dateTime: {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      },
      accountNo: senderAccountNo,
    });

    const depositTransaction = new transactionSchema({
      perior: receiverAccountNo,
      transType: "TRANSFER",
      amount: amount, // Deposit to receiver
      dateTime: {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      },
      accountNo: receiverAccountNo,
    });

    // Save both transactions
    const savedWithdrawal = await withdrawalTransaction.save();
    const savedDeposit = await depositTransaction.save();

    return res.status(200).json({
      withdrawal: savedWithdrawal,
      deposit: savedDeposit,
    });
  } catch (err) {
    return res.status(500).send("Error while transferring: " + err.message);
  }


});

module.exports = router;
