const router = require("express").Router();

const auth = require("../middlewares/auth");

//TODO create middlewares folder. validation.js file.   and validateArticleId function

const {
  validateArticleBody,
  validateArticleId,
} = require("../middlewares/validation");

const {
  deleteArticle,
  getArticles,
  createArticle,
} = require("../controllers/articles");

router.get("/", getArticles);
router.post("/", auth, validateArticleBody, createArticle);
router.delete("/:_id", auth, validateArticleId, deleteArticle);

module.exports = router;
