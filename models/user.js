const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
    default: "Elise Bouer",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then(async (user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      const valid = await bcrypt.compare(password, user.password);
      return valid
        ? user
        : Promise.reject(new Error("Incorrect email or password"));
    });
};

module.exports = mongoose.model("user", userSchema);
