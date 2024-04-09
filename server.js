const app = require("./src/app");
const PORT = 3050;
const server = app.listen(PORT, () => {
  console.log(`wsv eCommerce start with ${PORT}`);
});

// process.on("SIGINT", () => {
//   server.close(() => console.log("Exit Server Express"));
// });
