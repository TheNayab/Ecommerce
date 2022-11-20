const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");


// Handle uncaught exception
// process.on("uncaughtException", (err) => {
//   console.log(err);
//   console.log(`Shutting down the server due to unhandle uncaught exception`);
//   process.exit(1);
// });



// config
dotenv.config({ path: "backend/config/config.env" });

// Connect to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});



// Unhandled Promise rejections
// process.on("unhandledRejection", (reason) => {
//   console.log("Error:" + reason);
//   console.log(`Shutting down the server due to unhandled promise rejection`);

//   server.close(() => {
//     process.exit(1);
//   });
// });
