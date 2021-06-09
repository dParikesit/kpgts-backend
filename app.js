require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("DB Connection succeed");
});

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRoute = require("./api/routes/user");
app.use(userRoute);

const postRoute = require("./api/routes/post");
app.use(postRoute);

app.listen(process.env.PORT || 3001, () => {
  console.log("Process has started!");
});
