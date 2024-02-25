if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRoutes = require("./Routes/user");
const questionFormRoutes = require("./Routes/questionForm");
const ansFormRoutes = require("./Routes/ansForm");
const sendEmailRoutes = require("./Routes/sendEmail");

const { verifyToken } = require("./middleware/auth");

const app = express();

app.get("/", (req, res) => {
  res.send("server app running");
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests from the specified origin
      if (!origin || origin === "http://localhost:5173") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// {
//   credentials: true,
//   origin: process.env.CLIENT_URL,
// }
// app.get("/", (req, res) => {
//   return res.status(200).json({ message: "Heres your data" });
// });

// app.get("/trial", (req, res) => {
//   return res.status(200).json({ message: "Heres your trial data" });
// });

// app.use((req, res, next) => {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", `${process.env.CLIENT_URL}`);

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type,Authorization"
//   );

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middleware
//   next();
// });

app.use("/", userRoutes);
//console.log(userRoutes);
app.use("/questionForm", verifyToken, questionFormRoutes);
app.use("/sendEmail", verifyToken, sendEmailRoutes);
app.use("/ansForm", ansFormRoutes);

const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB connection succesfull");
    app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });
