const mongoose = require("mongoose");
const Admin = require("../Schemas/AdminSchema"); // Import the Admin model
const localDB = "mongodb://127.0.0.1:27017/testOne";

mongoose
  .connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.log(e);
  });

// Create a new IT admin
/*const admin = new Admin({});

// Save the IT admin to the database
admin
  .save()
  .then(() => {
    console.log("IT admin saved successfully.");
  })
  .catch((error) => {
    console.error("Failed to save IT admin:", error);
  });*/
