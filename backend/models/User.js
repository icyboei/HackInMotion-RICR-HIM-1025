const { ObjectId } = require("mongodb");

function createUserDocument({ name, email, password }) {
  return {
    name,
    email,
    password,
    createdAt: new Date(),
  };
}

module.exports = {
  createUserDocument,
};