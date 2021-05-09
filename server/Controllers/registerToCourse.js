const { Group, Student } = require("../Models/ModelExports");
const { isAllowedToRegister } = require("./Group");

//to register to a course
//student must have the secratekey,
//groupid share by teacher and the group number/id as well

//check if the group is exsist
//or a private
//(in that case student must provide their id to the teachers)
async function ValidateAndRegister(realStudentID, groupId, groupSecret) {
  //this will seache the database
  //for the given groupId
  //if found , then it will
  //check for the matching groupSecret
  //if a match return true, else false.
  let group = Group.exists({ _id: groupId });
  if (group) {
    let { message, private } = await isAllowedToRegister(groupId);
    if (!private) {
      //if not private run the register function
      //message has the secrate key
      if (groupSecret === message) {
        await RegisterANewStudent(realStudentID, groupId);
      } else {
        console.log("Your secrate key doesn't match");
      }
    } else {
      console.log("This is a private study group, send request to join");
    }
  }
}

async function RegisterANewStudent(realStudentID, groupId) {
  try {
    //first find if the same realStudentID exsist
    let exsist = await Group.exists({
      studentsId: realStudentID,
    });
    //if not exsist
    if (!exsist) {
      //push the realStudentID to the group
      let UG = await Group.updateOne(
        { _id: groupId },
        {
          $push: { studentsId: realStudentID },
        }
      );
      //push the groupId to the student
      let US = await Student.updateOne(
        { realStudentID: realStudentID },
        {
          $push: { groupsId: groupId },
        }
      );
      console.log(UG, US);
      return;
    }
    //if exsist show message
    console.log("You are already registered");
  } catch (err) {
    console.log("error while registration process", err);
  }
}

module.exports = {
  ValidateAndRegister,
};
