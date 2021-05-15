//check if the realStudetId exist in this current group
const Group = require("../Models/Group");
const { decode } = require("jsonwebtoken");
const AuthInAdmin = async (req, res, next) => {
  /**
   * this req have a :groupId paramerter
   */
  let gId = req.params.groupId;
  let base64URL = req.headers.authorization.split(" ")[1];
  let realId = decode(base64URL).realStudentID;
  try {
    let isInSameGroup = await Group.exists({
      _id: gId,
      adminid: realId,
    });
    if (isInSameGroup) {
      next();
    } else {
      res.status(401).send("Not possible, Your are not admin of this group");
    }
  } catch (error) {
    res.status(400).send("invalid group id");
  }
};

module.exports.AuthInAdmin = AuthInAdmin;
