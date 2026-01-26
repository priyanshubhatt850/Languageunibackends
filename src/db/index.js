const { env } = require("../constants");
mongoose.set("strictQuery", true);
module.exports.configure = (mongoose) => {
  let url =`${env.DB_URL}`
  console.log("url", url);
  let connect = function () {
    mongoose.connect(url, { useUnifiedTopology: true,
      useNewUrlParser: true,
      maxPoolSize: 20,
      minPoolSize: 5,
      // ⏱ Timeouts
      serverSelectionTimeoutMS: 7000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000 
    });
  };
  connect();
  let db = mongoose.connection;
  db.once("open", () => {
    console.log(`Connected to db \nenv ${env.NODE_ENV}`);
  });
  // db.on("disconnected", connect);
  db.on("error", console.log);
};
