const { Message } = require("../models/message.model.js");

const getMessagesByGroupId = (groupId) => {
  return Message.find({ groupId }).exec();
};

const createMessage = ({ userId, groupId, content, createdAt }) => {
  return Message.create({
    groupId,
    userId,
    content,
    createdAt,
  });
};

module.exports = {
  getMessagesByGroupId,
  createMessage,
};
