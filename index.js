const express = require("express");

const mongoose = require("mongoose");

const routes = require("./routes/routes");
const cors = require("cors");

const cookieParse = require("cookie-parser");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

app.use(cookieParse());

app.use(express.json());
app.use("/api", routes);
mongoose
  .connect("mongodb://localhost:27017/cartapp", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to db");
    app.listen(5000, () => {
      console.log("app is listening on port 5000");
    });
  });
