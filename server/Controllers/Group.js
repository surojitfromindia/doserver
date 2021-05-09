const { Group } = require("../Models/ModelExports");

/**Create a new study group
 * @param {Object} Group - a study group.
 * @param {string} Group.group_name - name of the study group.
 * @param {string} Group.admin - admin/creator of the group.
 * @param {boolean} Group.private - is the group private.
 * @param {string} Group.secrateKey - secrate key.
 * @returns {Promise} A promise of new group information
 * */
async function createNewGroup(groupPreDetails) {
  const NewGroup = new Group(groupPreDetails);
  try {
    let res = await NewGroup.save();
    console.log("New  Group is created");
    return res;
  } catch (err) {
    console.log("Something wrong happened");
    return;
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

module.exports = {
  createNewGroup,
  isAllowedToRegister,
};
