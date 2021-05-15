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
        let RegR = await RegisterANewStudent(realStudentID, groupId);
        return RegR;
      } else {
        console.log("Your secrate key doesn't match");
        return { message: "your secrate key doesn't macth" };
      }
    } else {
      console.log("This is a private study group, send request to join");
      return { message: "This is a private study group, send request to join" };
    }
  }
}

async function RegisterANewStudent(realStudentID, groupId) {
  try {
    //first find if the same realStudentID exsist

    let exsist = await Group.exists({
      _id: groupId,
      studentsId: realStudentID,
    });
    console.log(exsist);
    //if not exsist
    if (!exsist) {
      //push the realStudentID to the group
      let UG = await Group.updateOne(
        { _id: groupId },
        {
          $push: { studentsId: realStudentID },
        }
      );
      //push the groupId to the student and to the groupLesson array
      let US = await Student.updateOne(
        { realStudentID: realStudentID },
        {
          $push: { groupsId: groupId, groupsLessons: { groupId: groupId } },
        }
      );
      return { UG, US };
    } else {
      console.log("You are already registered");
      return { message: "Already registerd" };
    }
    //if exsist show message
  } catch (err) {
    console.log("error while registration process", err);
  }
}

module.exports = {
  ValidateAndRegister,
  RegisterANewStudent,
};
