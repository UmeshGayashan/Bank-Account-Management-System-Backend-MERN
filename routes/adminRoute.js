const express = require("express");
const accountSchema = require("../Schemas/accountSchema");
const router = express.Router();

router.post("/create-acc", async (req, res) => {
  try {
    const { name, email, initBalance } = req.body;
    const accountNo = Math.floor(Math.random() * 100000000);

    const newAcc = new accountSchema({
      holderName: name,
      holderEmail: email,
      accountNo: accountNo,
      balance: initBalance,
      //add username and password
    });

    // Save the new account to the database using async/await
    const savedAccount = await newAcc.save();

    return res.status(201).send(savedAccount); // Send HTTP 201 for resource creation along with the saved account's data
  } catch (err) {
    return res.status(500).send("Account creation failed: " + err.message); // Handle database errors
  }
});

router.put("/update-acc/:accNo", async (req, res) => {
  try {
    const accountNo = req.params.accNo;
    const updateData = req.body;
    console.log(updateData);
    const account = await accountSchema.findOneAndUpdate(
      { accountNo: accountNo },
      updateData,
      { new: true }
    );

    if (!account) {
      return res.status(404).send("Account not found");
    }

    return res.status(200).send(account);
  } catch (err) {
    return res
      .status(500)
      .send("Error while updating account information: " + err.message);
  }
});

router.delete("/delete-acc/:accNo", async (req, res) => {
  const accNo = req.params.accNo;

  try {
    const result = await accountSchema.findOneAndDelete({ accountNo: accNo });

    if (!result) {
      return res.status(404).json({ error: "Account not found" });
    }

    return res.status(200).json({ message: "Account removed" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error while deleting account", message: err.message });
  }
});

router.get("/acc-info/:accNo", async (req, res) => {
  try {
    const { accNo } = req.params;
    const account = await accountSchema.findOne({ accountNo: accNo });

    if (!account) {
      return res.status(404).send("Account not found");
    }

    return res.status(200).send(account);
  } catch (err) {
    return res
      .status(500)
      .send("Error while fetching account information: " + err.message);
  }
});

module.exports = router;
