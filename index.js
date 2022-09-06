const express = require("express");

const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");

var db = require("./config/database");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
var users = require("./routes/userRoute");
var saleman = require("./routes/salesmanRoute");

var admin = require("./routes/adminRoute");

const layouts = require("express-ejs-layouts");
const cors = require("cors");
const http = require("http");
var {
  passport,
  authAdmin,
  authManager,
  auther,
  autherization,
} = require("./auth/passport-auth");

const port = process.env.PORT || 3000;
const server = require("http").createServer(app);
var io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:19000",
  },
});
// const expressLayouts = require("express-ejs-layouts");
//database connection

// dotenv.config({ path: "config/.env" });

let env = process.env.NODE_ENV;

console.log("2@@ dotnev", process.env.NODE_ENV);

const whitelist = [
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:3001",
  "http://derzam.com",
  "https://derzam.com",
  "http://www.derzam.com",
  "https://www.derzam.com",
  "https://app.derzam.com",
  "http://app.derzam.com",
  "https://api.veevotech.com/sendsms",
  "http://api.veevotech.com/sendsms",
  "https://api.veevotech.com",
  "http://api.veevotech.com",
];
const corsOptions = {
  origin(origin, callback) {
    // console.log(
    //   "---------------------------------\n origin: ",
    //   origin,
    //   "\n---------------------------------"
    // );
    if (
      whitelist.indexOf(origin) !== -1 ||
      !origin ||
      (app.get("env") === "development" &&
        (origin.indexOf("192.168") >= 0 || origin === "null")) ||
      origin === "null"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
db.authenticate()
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err.message));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// app.get(
//   "/uploads/:name",
//   passport.authenticate("jwt", { session: false }),
//   async function (req, res, next) {
//     next();
//   }
// );
app.use(express.static(__dirname + "/public"));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ limit: "52428800", extended: true }));
app.use(bodyParser.json({ limit: "52428800", extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(layouts);
app.set("view engine", "ejs");

//routes

app.use("/users", users);
app.use("/admin", admin);
app.use("/salesman", saleman);

if (env === "production") {
  server.listen(process.env.PORT || 4000, () => {
    console.log(`Example app listening at http://localhost`);
  });
} else {
  server.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
  });
}

///////////////////////////////-socket conection and logic//////////////////////////////////////////
