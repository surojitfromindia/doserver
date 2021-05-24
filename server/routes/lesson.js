const router = require("express").Router();
const { decode } = require("jsonwebtoken");
const { JWTAuthM } = require("../Middlewares/AuthJWT");
const { AuthInGroup } = require("../Middlewares/GroupAuth");
const { AuthInTeacher } = require("../Middlewares/TeacherAuth");
const {
  getOnlyNewLessonOfGroup,
  getOnlyUpcomingLessonOfGroup,
  getAllLessonsOfGroup,
  copyLessonsFromStudyGroup,
  forceRefreshNewLessonFromStudyGroup,
  updatePState,
} = require("../Controllers/Student");
const { pushToATempLesson, getTempLesson } = require("../Controllers/Lesson");

/**Update Progress */
router.post("/:groupId/update/:sub", JWTAuthM, async (req, res) => {
  let uT = req.body;
  let gId = req.params.groupId;
  let sub = req.params.sub;
  let base64URL = req.headers.authorization.split(" ")[1];
  let realId = decode(base64URL).realStudentID;
  let nRP = await updatePState(realId, gId, sub, uT);
  if (nRP?.error) {
    res.send(nRP.error);
  } else if (nRP?.message) {
    res.send(nRP.message);
  } else res.send(nRP);
});
/**
 * Pull new lesson from group
 */
router.get("/:groupId/pull", JWTAuthM, AuthInGroup, async (req, res) => {
  let gId = req.params.groupId;
  let base64URL = req.headers.authorization.split(" ")[1];
  let realId = decode(base64URL).realStudentID;
  let nRP = await copyLessonsFromStudyGroup(realId, gId);
  if (nRP?.error) {
    res.send(nRP.error);
  } else if (nRP?.message) {
    res.send(nRP.message);
  } else res.send(nRP);
});
/**
 * Force Pull new/update lesson from group. override all topic traking.
 */
router.get("/:groupId/forcepull", JWTAuthM, AuthInGroup, async (req, res) => {
  let gId = req.params.groupId;
  let base64URL = req.headers.authorization.split(" ")[1];
  let realId = decode(base64URL).realStudentID;
  let nRP = await forceRefreshNewLessonFromStudyGroup(realId, gId);
  if (nRP?.error) {
    res.send(nRP.error);
  } else if (nRP?.message) {
    res.send(nRP.message);
  } else res.send(nRP);
});

/**
 * Get lessons from student.
 * Have multiple query parameters
 *
 * like ?new=true&up=true&old=true and their combinations
 */
router.get("/:groupId", JWTAuthM, AuthInGroup, async (req, res) => {
  let gId = req.params.groupId;
  let base64URL = req.headers.authorization.split(" ")[1];
  let realId = decode(base64URL).realStudentID;

  // Reftech/pull from group run only once
  await copyLessonsFromStudyGroup(realId, gId);

  let lt = req.query?.time ? req.query.time : "new";
  switch (lt) {
    case "new": {
      let nLR = await getOnlyNewLessonOfGroup(realId, gId);
      res.send(nLR);
      break;
    }
    case "up": {
      let uLR = await getOnlyUpcomingLessonOfGroup(realId, gId);
      res.send(uLR);
      break;
    }
    case "all": {
      let aLR = await getAllLessonsOfGroup(realId, gId);
      res.send(aLR);
      break;
    }
    case "old": {
      break;
    }
  }
});

/**
 * Get One lesson on request
 */

/**
 * Get temp lessons
 */
router.get("/:groupid/temp", AuthInTeacher, (req, res) => {});

/**
 * Create/update temp lessons
 */
router.post("/:groupid/temp", AuthInTeacher, async (req, res) => {
  let lessonBody = req.body;
  let gId = req.params.groupId;
  try {
    let pR = await pushToATempLesson(lessonBody, gId);
  } catch (error) {
    console.log(error);
  }
});
module.exports.LessonRoter = router;
