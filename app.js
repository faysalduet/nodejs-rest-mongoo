const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoute = require("./api/route/products");
const orderRoute = require("./api/route/orders");
const userRoute = require("./api/route/user");

mongoose.connect(
  "mongodb://mongo_ecomerce:" +
    process.env.MONGO_ALTAS_PW +
    "@cluster0-shard-00-00-zekyj.mongodb.net:27017,cluster0-shard-00-01-zekyj.mongodb.net:27017,cluster0-shard-00-02-zekyj.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
);

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Allow-Control-Origin", "*");
  res.header(
    "Access-Allow-Control-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Allow-Control-Methods", "PUT, GET, POST, PATCH, DETETE");
    return res.status(200).json({});
  }
  next();
});

//route it should handle request
app.use("/products", productRoute);
app.use("/orders", orderRoute);
app.use("/user", userRoute);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
