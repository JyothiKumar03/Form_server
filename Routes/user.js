const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const { verifyToken } = require("../middleware/auth");
const bcrypt = require("bcrypt");

console.log("router called");
router.post("/signup", async (req, res) => {
  console.log("sign up invoked");
  try {
    const { name, email, password } = req.body;
    console.log("sign up");

    // Add user to DB
    let existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "User With Email Already Exists" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({ name, email, password: hashedPassword });

    await user.save();

    // Make access token

    const accessToken = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.ACCESS_KEY,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "user created successfully ",
      user: { name, email, id: user._id, token: accessToken },
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("login");
    const { email, password } = req.body;
    let existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (!existingUser)
      return res.status(404).json({ message: "User Not Found" });

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      existingUser.password
    );
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Email or Password Incorrect" });

    const accessToken = jwt.sign(
      {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
      process.env.ACCESS_KEY,
      {
        expiresIn: "1d",
      }
    );

    console.log("accessToken", accessToken);
    // res.cookie("token", accessToken, {
    //   path: "/",
    //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
    //   sercure: true,
    //   sameSite: "none",
    //   domain: "formaker-server.onrender.com",
    // });

    res.status(200).json({
      message:
        "User is logged in successfully and access token is sent in cookie",
      user: {
        name: existingUser.name,
        id: existingUser._id,
        token: accessToken,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/authUser", verifyToken, async (req, res) => {
  const user = req.user;
  console.log(user);
  if (user) {
    return res
      .status(200)
      .json({ message: "User has been authenticated", user });
  }

  return res
    .status(401)
    .json({ message: "User not authenticated, has to login" });
});

router.post("/logout", (req, res) => {
  try {
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
