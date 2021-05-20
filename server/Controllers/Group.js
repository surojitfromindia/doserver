const { Group, Student } = require("../Models/ModelExports");
const { fromatWarning } = require("../utils/warning");

/**Create a new study group
 * @param {Object} Group - a study group.
 * @param {string} Group.group_name - name of the study group.
 * @param {string} Group.admin - admin/creator of the group.
 * @param {string} Group.adminid - id of admin/creator of the group.
 * @param {boolean} Group.private - is the group private.
 * @param {string} Group.secrateKey - secrate key.
 * @returns {Promise} A promise of new group information
 * */
async function createNewGroup(groupPreDetails, realStudentID) {
  //join the admin id,
  groupPreDetails.adminid = realStudentID;
  const NewGroup = new Group(groupPreDetails);
  try {
    //check if alreay group exist by that name.
    let alEx = await Student.exists({
      $and: [
        { realStudentID: realStudentID },
        { "createdGroupId.name": groupPreDetails.group_name },
      ],
    });
    if (!alEx) {
      await NewGroup.save();
      await Student.updateOne(
        { realStudentID: realStudentID },
        { $push: { createdGroupId: { name: groupPreDetails.group_name } } }
      );
      return { message: { type: "message", des: "Group Created" } };
    } else {
      return {
        message: {
          type: "warning",
          des: "Already have a group with same name ",
        },
      };
    }
  } catch (err) {
    console.log(err);
    console.log("Something wrong happened");
    return {
      message: {
        type: "error",
        des: "Enter Valid Parameters Only!",
      },
    };
  }
}

/**
 * Return if the user/student is allowed to join a group/study group
 * @param {string} groupId in this case mongodb _id of a study group
 * @returns {Object} An Object with secrateKey if group is not private else return false with message
 */
async function isAllowedToRegister(groupId) {
  try {
    let { private, secrateKey } = await Group.findOne({ _id: groupId });
    return private
      ? { private: private, message: "Group is private" }
      : { private: private, message: secrateKey };
  } catch (err) {
    console.log(
      "Something wrong happened while searching for group visibility"
    );
  }
}

/**
 * Remove a student from group.
 * the student will no longer able to recive new lessons
 * @param {string} realStudentID
 * @param {string} groupId
 */
async function removeOrBan(realStudentID, groupId) {
  try {
    let rB = await Group.findOneAndUpdate(
      { _id: groupId },
      { $pull: { studentsId: realStudentID } },
      { useFindAndModify: false }
    );
    return rB;
  } catch (error) {
    console.log("Something wrong happened while banning");
    console.log(error);
    return { error: "Some error while banning" };
  }
}

/**
 * Return non-hidden info like group name, creation date,
 * upcoming, old, new (upadted) lessons, and other students name, picture.
 * @param {String} groupId
 * @returns {Promise} A promise
 */
async function getNonHiddenInfo(groupId) {
  try {
    let rGNHI = await Group.findOne(
      { _id: groupId },
      { TempLesson: 0, adminid: 0, secrateKey: 0 }
    );
    return rGNHI;
  } catch (error) {
    console.log("Something wrong happened while fetching group info", error);
    return { error: "some error" };
  }
}

async function getGroupInfoAdmin(realStudentID, gname) {
  try {
    let rGNHI = await Group.findOne({
      adminid: realStudentID,
      group_name: gname,
    });
    return rGNHI;
  } catch (error) {
    console.log("Something wrong happened while fetching group info", error);
    return { error: "some error" };
  }
}
/**
 * Delete a study group that was created by user/admin.
 * Only admin of the group can delete that group.
 * Student registered to that group will recive a notification,
 * but can access all old lesson, unless admin mark it explicitliy to remove
 * group id from Student/user document too.
 * @param {String} gname Name of the group
 * @param {String} adminid Admin Id/email
 * @returns {Object} Returns a warning object
 */
async function DeleteGroup(gname, adminid) {
  try {
    //remove the group
    await Group.findOneAndRemove(
      { group_name: gname, adminid: adminid },
      { useFindAndModify: false }
    );
    //remove groupid from createdGroup section of user
    await Student.findOneAndUpdate(
      { realStudentID: adminid },
      { $pull: { createdGroupId: { name: `${gname}` } } },
      { useFindAndModify: false }
    );

    return { message: { type: "message", des: "Group Deleted" } };
  } catch (error) {
    console.log("Something wrong happened while fetching group info", error);
    return { message: { type: "error", des: "Error Occured" } };
  }
}

async function UpdateTeacher(gname, adminid, updatedTeacherArray) {
  try {
    await Group.findOneAndUpdate(
      { group_name: gname, adminid: adminid },
      { $set: { teachersId: updatedTeacherArray } },
      { useFindAndModify: false }
    );
    return { message: { type: "message", des: "Teacher list updated" } };
  } catch (error) {
    console.log("Something wrong happened while fetching group info", error);
    return { message: { type: "error", des: "Error Occured" } };
  }
}

module.exports = {
  UpdateTeacher,
  DeleteGroup,
  createNewGroup,
  isAllowedToRegister,
  removeOrBan,
  getNonHiddenInfo,
  getGroupInfoAdmin,
};
