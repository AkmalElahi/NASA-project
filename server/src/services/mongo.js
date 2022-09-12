const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://node-api:TJeKn7jGu2xEdZkw@cluster0.1r9gjt3.mongodb.net/nasa?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("Database connection is ready...");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function connectMongo() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function disconnectMongo() {
  await mongoose.disconnect();
}

module.exports = {
  connectMongo,
  disconnectMongo,
};
