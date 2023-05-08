const mongoose = require("mongoose");

const connectDB = (url) => {
  console.log("MongoDB has been started successfully");
  return mongoose.connect(url, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
