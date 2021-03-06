const router = require("express").Router();
const { decode } = require("jsonwebtoken");
const { AuthInGroup } = require("../Middlewares/GroupAuth");
const { JWTAuthM } = require("../Middlewares/AuthJWT");
const { AuthInAdmin } = require("../Middlewares/AdminAuth");
const {
  getNonHiddenInfo,
  createNewGroup,
  removeOrBan,
  getGroupInfoAdmin,
  DeleteGroup,
  UpdateTeacher,
} = require("../Controllers/Group");

/**
 * Create a new group. and set the creators id/name as admin.
 * post payload is initial group info check Group model
 */
router.post(
  "/:groupId/:idToBan/ban",
  JWTAuthM,
  AuthInAdmin,
  async (req, res) => {
    let idtoBan = req.params.idToBan;
    let gId = req.params.groupId;
    try {
      let gSBR = await removeOrBan(idtoBan, gId);
      if (gSBR?.error) {
        res.send(gSBR.error);
      } else res.send(gSBR);
    } catch (err) {
      res.send({ error: "error in sever" });
    }
  }
);

/**
 * Create a new group. and set the creators id/name as admin.
 * post payload is initial group info check Group model
 */
router.post("/new", JWTAuthM, async (req, res) => {
  //get user name from token
  let base64URL = req.headers.authorization.split(" ")[1];
  let realId = decode(base64URL).realStudentID;

  let groupPreInfo = req.body;
  try {
    let gCR = await createNewGroup(groupPreInfo, realId);
    if (gCR?.error) {
      res.send(gCR.error);
    } else res.send(gCR);
  } catch (err) {
    res.send({ error: "error in sever" });
  }
});

router.delete("/:gname/delete", async (req, res) => {
  let gn = req.params.gname;
  let base64URL = req.headers.authorization.split(" ")[1];
  let aid = decode(base64URL).realStudentID;
  try {
    let dR = await DeleteGroup(gn, aid);
    console.log(dR);
    res.send(dR);
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});

//Update teacher.
router.post("/:gname/update/teacher", async (req, res) => {
  let gn = req.params.gname;
  let updateTeacherArray = req.body;
  let base64URL = req.headers.authorization.split(" ")[1];
  let realId = decode(base64URL).realStudentID;
  try {
    let gninfoRes = await UpdateTeacher(gn, realId, updateTeacherArray);
    res.send(gninfoRes);
  } catch (err) {}
});

router.get("/:gname/admin", async (req, res) => {
  let gn = req.params.gname;
  let base64URL = req.headers.authorization.split(" ")[1];
  let realId = decode(base64URL).realStudentID;
  try {
    let gninfoRes = await getGroupInfoAdmin(realId, gn);
    if (gninfoRes?.error) {
      res.send("Some error occured while fetching group info");
    } else res.send(gninfoRes);
  } catch (err) {}
});

/**
 * Get group public info (though only to the registered students)
 * e.g number og students (count studentIds), teachers and admin name.
 * newLesson, oldLessons, upcoming lesson etc.
 */
//But check if he is registered in that group, use AuthInGroup middleware
router.get("/:groupId/", AuthInGroup, async (req, res) => {
  let gId = req.params.groupId;
  try {
    let gninfoRes = await getNonHiddenInfo(gId);
    if (gninfoRes?.error) {
      res.send("Some error occured while fetching group info");
    } else res.send(gninfoRes);
  } catch (err) {}
});

module.exports.GroupRouter = router;
