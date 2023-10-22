const accountSchema = require("../Schemas/accountSchema");

const depositAmount = async (accountNo, amount) => {
  try {
    console.log(accountNo)
    const data = await accountSchema.findOne({ accountNo: accountNo });

    if (!data) {
      throw new Error("Failed to deposit");
    }

    const updatedBalance = data.balance + amount;

    await accountSchema.findOneAndUpdate(
      { accountNo: accountNo },
      {
        $inc: { balance: amount },
      }
    );

    return amount;
  } catch (err) {
    console.log(err)
    // throw new Error("Failed to deposit");
  }
};

const withdrawAmount = async (accountNo, amount) => {
  try {
    const data = await accountSchema.findOne({ accountNo: accountNo });

    if (!data || data.balance < amount) {
      //throw new Error("Failed to withdraw");,
      console.log("Failed to withdraw")
    }

    const updatedBalance = data.balance - amount;

    await accountSchema.findOneAndUpdate(
      { accountNo: accountNo },
      {
        $inc: { balance: -amount },
      }
    );

    return amount;
  } catch (err) {
    console.log(err)

    // throw err; // Re-throw the original error.
  }
};

async function transferAmount(fromAcc, toAcc, amount) {
  const from = await accountSchema.findOne({ accountNo: fromAcc });
  const to = await accountSchema.findOne({ accountNo: toAcc });

  if (!from || !to) {
    return null;
  }

  try {
    const session = await accountSchema.startSession();
    session.startTransaction();

    const options = { session };

    // Update the sender's balance (subtract the amount)
    const fromUpdate = await accountSchema.findOneAndUpdate(
      { accountNo: fromAcc },
      {
        $inc: { balance: -amount },
      },
      options
    );

    if (!fromUpdate) {
      await session.abortTransaction();
      session.endSession();
      return null;
    }

    // Update the receiver's balance (add the amount)
    const toUpdate = await accountSchema.findOneAndUpdate(
      { accountNo: toAcc },
      {
        $inc: { balance: amount },
      },
      options
    );

    if (!toUpdate) {
      await session.abortTransaction();
      session.endSession();
      return null;
    }

    await session.commitTransaction();
    session.endSession();

    return "Updated Successfully";
  } catch (err) {
    console.log(err)

    // return null;
  }
}

module.exports = { depositAmount, withdrawAmount, transferAmount };
