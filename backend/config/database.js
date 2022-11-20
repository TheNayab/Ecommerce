const mongoose = require("mongoose");

const ConnectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log("Connect to database Successfully");
    })
    .catch((err) => {
      error: err.message;
    });
};
// , {
//     useNewURL: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   }
module.exports = ConnectDatabase;
