const router = require("express").Router();

const articles = require("./articles");
const users = require("./users");

const { createUser, login } = require("../controllers/users");
//TODO create utils folder and NotFoundError.js File.  create NotFoundError function
const { NotFoundError } = require("../utils/NotFoundError");

//TODO create validateUserAuthentication function and validateUserInfoBody function in validation.js file.
const {
  validateUserAuthentication,
  validateUserInfoBody,
} = require("../middlewares/validation");

router.use("/articles", articles);
router.use("/users", users);

router.post("/signup", validateUserInfoBody, createUser);

router.post("/signin", validateUserAuthentication, login);

router.use("/", (req, res, next) => {
  next(new NotFoundError());
});

module.exports = router;
