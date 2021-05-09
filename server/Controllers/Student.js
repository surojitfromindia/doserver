const {  Group } = require("../Models/ModelExports");

var student = exports;

/**
 *@param {string} realStudenID
 *@param {string} groupId
 */
student.copyLessonsFromStudyGroup = async (realStudentID, groupId) => {
  /*
  first check if the student is registered with the mentioned study group
  then fetch recent entries from the group.
  push it into the students section
  */
  let exist = await Group.exists({
    $and: [{ _id: groupId }, { studentsId: realStudentID }],
  });
  if (exist) {
    //fetch group values
    console.log("Value fetched");
  } else {
    console.log(
      "You are not registerd with this group or the group no longer exists"
    );
  }
};
