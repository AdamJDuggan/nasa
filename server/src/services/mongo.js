const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://AdamJDuggan:sfeRiLnEISn1L8HN@nasacluster.s4boukg.mongodb.net/nasa?retryWrites=true&w=majority";

mongoose.connection.once("open", () => console.log("MongoDB ready"));
mongoose.connection.on("error", (err) => console.error("MongoDB error: ", err));

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };
