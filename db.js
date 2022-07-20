const mongoose = require("mongoose");

// let mongoURL =
//   "mongodb+srv://kartikey:12345@demo.wdy1l.mongodb.net/sheyrooms?retryWrites=true&w=majority";
let mongoURL =
  "mongodb+srv://admin:admin@authentication.ukanr.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoURL, { useUnifiedTopology: true, useNewUrlParser: true });

let connection = mongoose.connection;

connection.on("error", () => {
  console.log("MongoDB connection failed");
});
connection.on("connected", () => {
  console.log("MongoDB connection successful");
});

module.exports = mongoose;
