const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.DB_URL);
  console.log(`mongo connected: ${conn.connection.host}`);
};

module.exports = connectDB;
