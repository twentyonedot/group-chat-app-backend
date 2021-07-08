const { User } = require("../models/user.model");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

/* const getUserById = async (id) => {
  return User.findById(id);
};
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const createUser = async (userBody) => {
  console.log(userBody)
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.OK, "Email already taken");
  }
  const user = await User.create(userBody);
  return user;
};

module.exports = {
  getUserByEmail,
  createUser,
};
