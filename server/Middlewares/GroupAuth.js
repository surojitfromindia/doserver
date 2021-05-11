//check if the realStudetId exist in this current group
const Group = require("../Models/Group");

const AuthInGroup = async (req, res, next) => {
  /**
   * this req have a :groupId paramerter
   */
  let gId = req.params.groupId;
  let otherStudenRealId = req.params.realStudentID;
  try {
    let isInSameGroup = await Group.exists({
      _id: gId,
      studentsId: otherStudenRealId,
    });
    if (isInSameGroup) {
      next();
    } else {
      res.status(401).send("Not possible, you don't belong to same group");
    }
  } catch (error) {
    res.status(400).send("invalid group id");
  }
};

module.exports.AuthInGroup = AuthInGroup;
