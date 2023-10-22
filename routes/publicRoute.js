const express = require("express");
const router = express.Router();
const userSchema = require("../Schemas/userSchema");
const accountSchema = require("../Schemas/accountSchema");
const transactionSchema = require("../Schemas/TransactionSchema");
const { generateToken } = require("../extras/JWT");

// Registration Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    console.log("Hello");

    // Create a new user document
    const newUser = new userSchema({
      name: name,
      email: email,
      username: username,
      password: password,
    });
    console.log(newUser);

    // Save the user to the database using async/await
    const savedUser = await newUser.save();

    return res.status(201).send(savedUser); // Send HTTP 201 for resource creation along with the saved user's data
  } catch (err) {
    return res.status(500).send("User registration failed: " + err.message); // Handle database errors
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and Password required");
    }

    // Use async/await to find a user by username and password
    const user = await userSchema.findOne({
      username: username,
      password: password,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json({ token: generateToken(user._id) });
  } catch (err) {
    return res.status(500).send("Login failed: " + err.message);
  }
});



module.exports = router;
