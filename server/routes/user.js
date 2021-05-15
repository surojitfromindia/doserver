const router = require("express").Router();
const { JWTAuthM } = require("../Middlewares/AuthJWT");
const { AuthInGroup } = require("../Middlewares/GroupAuth");
const { decode } = require("jsonwebtoken");
const { getInfo, getNonHiddenInfo } = require("../Controllers/Student");
const { ValidateAndRegister } = require("../Controllers/registerToCourse");
const { LessonRoter } = require("./lesson");

/**
 * Register to a group
 *
 */
router.post("/register/:groupId", JWTAuthM, async (req, res) => {
  let key = req.query.skey;
  console.log(key);
  let base64URL = req.headers.authorization.split(" ")[1];
  //get user name from token
  let realId = decode(base64URL).realStudentID;
  let gId = req.params.groupId;
  try {
    let newRegRes = await ValidateAndRegister(realId, gId, key);
    if (newRegRes?.message) {
      res.send(newRegRes);
    } else res.send(newRegRes);
  } catch (err) {}
});

/**
 *Return non personal infos of a user like name, age, picture
 */
//todo: give a GroupAuth. like if they exist in same group.
router.get(
  "/:groupId/:realStudentID",
  JWTAuthM,
  AuthInGroup,
  async (req, res) => {
    let realId = req.params.realStudentID;
    try {
      let getInfoRes = await getNonHiddenInfo(realId);
      if (getInfoRes?.error) {
        res.status(404).send("Sorry!");
      } else {
        res.send(getInfoRes);
      }
    } catch (err) {
      res.status(500);
    }
  }
);



/**
 * Return user info like study group that he/she is in and created
 *
 */
router.get("/self", JWTAuthM, async (req, res) => {
  let base64URL = req.headers.authorization.split(" ")[1];
  //get user name from token
  let realId = decode(base64URL).realStudentID;
  try {
    let getInfoRes = await getNonHiddenInfo(realId);
    if (getInfoRes?.error) {
      res.status(404).send("Sorry!");
    } else {
      res.send(getInfoRes);
    }
  } catch (err) {
    res.status(500);
  }
});

/**
 * Return user info like study group that he/she is in and created
 *
 */
router.get("/", JWTAuthM, async (req, res) => {
  let base64URL = req.headers.authorization.split(" ")[1];
  //get user name from token
  let realId = decode(base64URL).realStudentID;
  try {
    let getInfoRes = await getInfo(realId);
    if (getInfoRes?.error) {
      res.status(404).send("Sorry!");
    } else {
      res.send(getInfoRes);
    }
  } catch (err) {
    res.status(500);
  }
});

module.exports.userRouter = router;
