const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(`mongodb://127.0.0.1:27017/shopDev`);
    console.log("connect successfully");
  } catch (error) {
    console.log("db connect is failed");
    throw new Error(error);
  }
};

module.exports = { dbConnect };
