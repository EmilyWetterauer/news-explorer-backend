const bcrypt = require("bcrypt");

const User = require("../models/user");

//TODO create BadRequestError and ConflictError and NotFoundError functions.

const { BadRequestError } = require("../utils/BadRequestError");
const { ConflictError } = require("../utils/ConflictError");
const { NotFoundError } = require("../utils/NotFoundError");

function createUser(req, res, next) {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) =>
    User.create({ name, email, password: hash })

      .then((user) => {
        res.send({ data: { name, email, _id: user._id } });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          next(new BadRequestError("invalid data"));
        } else if (err.code === 11000) {
          next(new ConflictError("unique constraint violation."));
        } else {
          next(err);
        }
      })
  );
}

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("No user with matching ID found");
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports = {
  createUser,
  getCurrentUser,
};
