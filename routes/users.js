const router = require("express").Router();

//TODO  make sure auth function is good to go in middlewares folder auth.js file

const auth = require("../middlewares/auth");

//TOD create users.js file in controllers folder.  create getCurrentUser function in that file.

const { getCurrentUser } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);

module.exports = router;
