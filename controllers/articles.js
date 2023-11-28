//TODO create NotFoundError and ForbiddenError and BadRequestError functions.
const { NotFoundError } = require("../utils/NotFoundError");
const { ForbiddenError } = require("../utils/ForbiddenError");
const { BadRequestError } = require("../utils/BadRequestError");

const Article = require("../models/article");

const getArticles = (req, res, next) => {
  Article.find()
    .sort({ createdAt: -1 })
    .then((articles) => res.send(articles))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const owner = req.user._id;
  const { keyword, title, text, date, source, link, image } = req.body;

  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((article) => {
      res.status(200).send({ data: article });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("invalid data"));
      } else {
        next(err);
      }
    });
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params._id)
    .orFail(() => {
      throw new NotFoundError("No article with matching ID found");
    })
    .then((article) => {
      if (!article.owner.equals(req.user._id)) {
        return next(
          new ForbiddenError("You are not authorized to delete this article")
        );
      }
      return article.deleteOne({ _id: article._id }).then(() => {
        res.status(200).send({ message: "Article deleted" });
      });
    })
    .catch(next);
};

module.exports = { getArticles, createArticle, deleteArticle };
