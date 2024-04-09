const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
mongoose;
const countConnect = () => {
  const numConnection = mongoose.connection.length;
  console.log(`Number of connection:: ${numConnection}`);
  console.log(` cores of my computer:: ${os.cpus().length}`);
};
module.exports = { countConnect };
