const express = require("express");
const router = express.Router();
const User = require("../Schemas/userSchema");
//const { authMiddleware } = require("../extras/JWT");

// Create a new user
router.post("/create-user", async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = new User({ name, email, username, password });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: "User creation failed", message: error.message });
  }
});

// Update user information (with authentication)
router.put("/update-user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: "User update failed", message: error.message });
  }
});

// Delete a user (with authentication)
router.delete("/delete-user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndRemove(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User removed" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "User deletion failed", message: error.message });
  }
});

//to get all users
router.get("/get-all-users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users", message: error.message });
  }
});

module.exports = router;
