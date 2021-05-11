const { SignUpRouter } = require("./singnUp");
const { LogInRouter } = require("./login");
const { userRouter } = require("./user");

const router = require("express").Router();

router.use("/newsignup", SignUpRouter);
router.use("/login", LogInRouter);
router.use("/user", userRouter);

module.exports.api = router;
