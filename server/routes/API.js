const { SignUpRouter } = require("./singnUp");
const { LogInRouter } = require("./login");
const { userRouter } = require("./user");
const { GroupRouter } = require("./group");
const { LessonRoter } = require("./lesson");
const { JWTAuthM } = require("../Middlewares/AuthJWT");

const router = require("express").Router();

router.get("/", JWTAuthM, (req, res) => {
  res.send({ message: "ok" });
});
router.use("/group", GroupRouter);
router.use("/newsignup", SignUpRouter);
router.use("/login", LogInRouter);
router.use("/user", userRouter);
router.use("/lesson", LessonRoter);

module.exports.api = router;
