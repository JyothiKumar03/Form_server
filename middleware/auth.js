const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(req.originalUrl);
    if (token !== undefined) {
      const user = jwt.verify(token, process.env.ACCESS_KEY);
      req.user = user;
      console.log("user", user);
    } else {
      console.log("No token");
    }
    console.log("token", token);
    next();
  } catch (error) {
    console.log("error in verifyToken");
    console.log(error);
    return res.status(401).json({ message: error.message });
  }
};

exports.verifyToken = verifyToken;
