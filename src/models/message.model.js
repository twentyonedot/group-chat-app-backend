const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  groupId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = {
  Message,
};
