const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./db/connect");
const cors = require("cors");
const app = express();

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
