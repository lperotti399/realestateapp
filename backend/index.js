const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const authController = require("./controllers/authController");
const propertyController = require("./controllers/propertyController");
const uploadController = require("./controllers/uploadController");
const app = express();

//routes & middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authController);
app.use("/property", propertyController);
app.use("/upload", uploadController);

//mongodb connect
const connectDB = (url) => {
  return mongoose.connect(url);
  //mongoose.set("strictQuery", false);
};

module.exports = connectDB;
//starting server
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    //mongodb connect
    await connectDB(process.env.MONGO_URL);
    //start server
    app.listen(port, () =>
      console.log(`Server has been started successfully on port ${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
