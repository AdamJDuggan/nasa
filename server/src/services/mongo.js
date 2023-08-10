const mongoose = require("mongoose");

// Required to run tests
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => console.log("MongoDB ready"));
mongoose.connection.on("error", (err) => console.error("MongoDB error: ", err));

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };
