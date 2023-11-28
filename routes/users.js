const router = require("express").Router();

//TODO  make sure auth function is good to go in middlewares folder auth.js file

const auth = require("../middlewares/auth");

const { getCurrentUser } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);

module.exports = router;
