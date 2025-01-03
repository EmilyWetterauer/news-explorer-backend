const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;
const { UnauthorizedError } = require("../utils/UnauthorizedError");

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    //added a return on line 13 so that authorization did not return undefined on line 16
    return next(new UnauthorizedError("authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError("authorization required"));
  }
  req.user = payload;
  next();
}

module.exports = auth;
