const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./db/connect");
const cors = require("cors");
const authController = require("./controllers/authController");
const app = express();

//routes & middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authController);
app.use("/property", propertyController);

//mongodb connect
//starting server
const start = async () => {
  try {
    //mongodb connect
    await connectDB(process.env.MONGO_URL);
    //start server
    app.listen(process.env.PORT, () =>
      console.log("Server has been started successfully")
    );
  } catch (error) {
    console.log(error);
  }
};

start();
