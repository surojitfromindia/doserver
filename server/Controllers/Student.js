const { Group, Student, Cred } = require("../Models/ModelExports");
var student = exports;

/**
 * Copy recently published/issued lesson from study group.
 * Teachers/group admin can also push them. only
 *@param {string} realStudentID
 *@param {string} groupId
 */
student.copyLessonsFromStudyGroup = async (realStudentID, groupId) => {
  /*
  first check if the student is registered with the mentioned study group
  then fetch recent entries from the group.
  push it into the students section.
  */
  let exist = await Group.exists({
    $and: [{ _id: groupId }, { studentsId: realStudentID }],
  });
  if (exist) {
    /*fetch group values
    first check if new record exist within student
    for that match newLesson id both (group's as well as student's)*/
    /*Get NewLesson from group */
    let { NewLesson } = await Group.findOne({ _id: groupId });
    let newLessonFromGroup = NewLesson;
    /*Update the newlesson  */
    let rU = await Student.findOneAndUpdate(
      {
        $and: [
          { realStudentID: realStudentID },
          { "groupsLessons.groupId": groupId },
          { "groupsLessons.NewLesson._id": { $ne: newLessonFromGroup?._id } },
        ],
      },
      {
        $set: {
          "groupsLessons.$.NewLesson": NewLesson,
        },
      },
      {
        useFindAndModify: false,
      }
    );
    if (rU === null) return { message: "Data already fetched" };
    else return { rU };
  } else {
    console.log(
      "You are not registerd with this group or the group no longer exists"
    );
    return { error: "group doen't exist" };
  }
};

/**
 * The this will force refresh every thing, from subject to topic including quizes.
 * don't call it without user permission (e.g provide a visual clue like button)
 *@param {string} realStudentID
 *@param {string} groupId
 */
student.forceRefreshNewLessonFromStudyGroup = async (
  realStudentID,
  groupId
) => {
  /*
  first check if the student is registered with the mentioned study group
  then fetch recent entries from the group.
  push it into the students section.
  */
  let exist = await Group.exists({
    $and: [{ _id: groupId }, { studentsId: realStudentID }],
  });
  if (exist) {
    let { NewLesson } = await Group.findOne({ _id: groupId });
    /*Update the newlesson  */
    let rU = await Student.findOneAndUpdate(
      {
        $and: [
          { realStudentID: realStudentID },
          { "groupsLessons.groupId": groupId },
        ],
      },
      {
        $set: {
          "groupsLessons.$.NewLesson": NewLesson,
        },
      },
      {
        useFindAndModify: false,
      }
    ).exec();
  } else {
    console.log(
      "You are not registerd with this group or the group no longer exists"
    );
  }
};

/**
 * Returns only the new lesson from given group id
 *@param {string} realStudentID
 *@param {string} groupId
 */
student.getOnlyNewLessonOfGroup = async (realStudentID, groupId) => {
  try {
    let { groupsLessons } = await Student.findOne(
      {
        realStudentID: realStudentID,
      },
      { groupsLessons: 1 }
    );
    let thisGroupLatestLesson = groupsLessons.filter(
      (grouplesson) => grouplesson.groupId === groupId
    );

    return thisGroupLatestLesson[0].NewLesson;
  } catch (err) {}
};

/**
 * Returns only the old lesson(s) from given group id
 *@param {string} realStudentID
 *@param {string} groupId
 */
student.getOnlyOldLessonsOfGroup = async (realStudentID, groupId) => {
  try {
    let { groupsLessons } = await Student.findOne(
      {
        realStudentID: realStudentID,
      },
      { groupsLessons: 1 }
    );
    let thisGroupLatestLesson = groupsLessons.filter(
      (grouplesson) => grouplesson.groupId === groupId
    );
    return thisGroupLatestLesson[0].OldLessons;
  } catch (err) {}
};

/**
 * Returns only the upcoming lesson(s) from given group id
 *@param {string} realStudentID
 *@param {string} groupId
 */
student.getOnlyUpcomingLessonOfGroup = async (realStudentID, groupId) => {
  try {
    let { groupsLessons } = await Student.findOne(
      {
        realStudentID: realStudentID,
      },
      { groupsLessons: 1 }
    );
    let thisGroupLatestLesson = groupsLessons.filter(
      (grouplesson) => grouplesson.groupId === groupId
    );
    return thisGroupLatestLesson[0].UpcomingLesson;
  } catch (err) {}
};

/**
 * Returns ALL lesson(s) from given group id
 *@param {string} realStudentID
 *@param {string} groupId
 */
student.getAllLessonsOfGroup = async (realStudentID, groupId) => {
  try {
    let { groupsLessons } = await Student.findOne(
      {
        realStudentID: realStudentID,
      },
      { groupsLessons: 1 }
    );
    let thisGroupLatestLesson = groupsLessons.filter(
      (grouplesson) => grouplesson.groupId === groupId
    )[0];

    return thisGroupLatestLesson;
  } catch (err) {}
};

/**
 *Returns hidden group and study info
 *@param {String} realStudentID student email.
 */

student.getInfo = async (realStudentID) => {
  try {
    let sinfo = await Student.findOne(
      { realStudentID: realStudentID },
      { groupsId: 1, realStudentID: 1, createdGroupId: 1 }
    );
    return sinfo;
  } catch (err) {
    return { error: "Some error occured when fetch info" };
  }
};

/**
 *Returns non hidden info of a student or user.
 *@param {String} realStudentID student email.
 */
student.getNonHiddenInfo = async (realStudentID) => {
  try {
    let sinfo = await Cred.findOne(
      { realStudentID: realStudentID },
      { age: 1, name: 1, _id: 0 }
    );
    return sinfo;
  } catch (err) {
    return { error: "Some error occured when fetch info" };
  }
};

/**
 *Returns Update topic when user mark some topic as done.
 *@param {String} realStudentID student email.
 *@param {String} gRid group id.
 *@param {String} subj subject that you want to update.
 *@param {String} updatedPrgoress the updated topic (personal copied from study group).
 */
student.updatePState = async (realStudentID, gRid, subj, updatedPrgoress) => {
  try {
    let l = await Student.findOneAndUpdate(
      {
        realStudentID: realStudentID,
      },
      {
        $set: {
          "groupsLessons.$[gid].NewLesson.allSubjects.$[sub].topic":
            updatedPrgoress,
        },
      },
      {
        upsert: true,
        arrayFilters: [{ "gid.groupId": gRid }, { "sub.subName": subj }],
        useFindAndModify: false,
      }
    );

    return l;
  } catch (err) {}
};
