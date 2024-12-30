const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const User = require("../models/user");
const { UnauthorizedError } = require("../utils/UnauthorizedError");

const { BadRequestError } = require("../utils/BadRequestError");
const { ConflictError } = require("../utils/ConflictError");
const { NotFoundError } = require("../utils/NotFoundError");

//**STEPS FOR CREATE USER**//

//VS CODE
//create function
//include necessary items for the body
//authorization?
//create route in index.js and users.js

//POST MAN
//sprint 16 folder...index.js folder....articles.js folder...users.js folder
//add request--name it "createUser" in the index.js folder
//POST   {{baseUrl}}/signup
//add object to the body..including {name:, email:, password:}
//change name and email each time ...press...SEND...to create a new user..then check mongoDB

//MONGODB
//sprint 16 database.
//2 folders...users and articles
//data should show up in these 2 folders if given routes are accurate

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

function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((e) => {
      console.log("e", e);
      next(new UnauthorizedError("Incorrect email or password"));
    });
}

module.exports = {
  createUser,
  getCurrentUser,
  login,
};
