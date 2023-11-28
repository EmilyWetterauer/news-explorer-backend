const router = require("express").Router();

//TODO create auth.js file inside middlewares folder.  create auth function

const auth = require("../middlewares/auth");

//TODO create middlewares folder. validation.js file.   and validateArticleId function

const {
  validateArticleBody,
  validateArticleId,
} = require("../middlewares/validation");

//TODO create functions in controllers articles.

const {
  deleteArticle,
  getArticles,
  createArticle,
} = require("../controllers/articles");

router.get("/", getArticles);
router.post("/", auth, validateArticleBody, createArticle);
router.delete("/:_id", auth, validateArticleId, deleteArticle);

module.exports = router;
