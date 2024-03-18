const express = require("express");
const mongodb = require("mongodb");
const mongoose = require("mongoose");

const routes = require("./routes/routes");
const cors = require("cors");

const cookieParse = require("cookie-parser");

const app = express();

// app.use(
//   cors({
//     credentials: true,
//     origin: ["http://localhost:4200"],
//   })
// );

app.use(cookieParse());

app.use(express.json());
app.use("/api", routes);
mongoose
  .connect("mongodb+srv://arunsinghpundir325:root@cluster-cartapp.yneymb8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-cartapp/cartapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
    app.listen(5000, () => {
      console.log("app is listening on port 5000");
    });
  });


  // "mongodb://arunsinghpundir325:mTjlBItRD7WD6JL7@cluster-cartapp-shard-00-00.nbp7d.mongodb.net:27017,cluster-cartapp-shard-00-01.nbp7d.mongodb.net:27017,cluster-cartapp-shard-00-02.nbp7d.mongodb.net:27017/cartapp?ssl=true&replicaSet=atlas-11wic9-shard-0&authSource=admin&retryWrites=true&w=majority

  