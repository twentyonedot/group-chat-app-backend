const { Group } = require("../models/group.model.js");

const getGroups = () => {
  return Group.find({});
};

const insertPredefinedGroups = (data) => {
  Group.countDocuments().then((count) => {
    if (count === 0) {
      Group.collection.insertMany(data);
    }
  });
};

module.exports = {
  getGroups,
  insertPredefinedGroups,
};
