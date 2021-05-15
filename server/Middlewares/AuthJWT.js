const jwt = require("jsonwebtoken");
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, `${process.env.PKEY}`, (err, user) => {
      if (err) {
        return res.status(403).send("You don't have auth token");
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports.JWTAuthM = authenticateJWT;
