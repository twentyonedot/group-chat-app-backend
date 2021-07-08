const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Group = mongoose.model("Group", groupSchema);

module.exports = {
  Group,
};
