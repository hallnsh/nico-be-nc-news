const { fetchArticleById } = require("../models/articles.models");
const { insertCommentByArticleId, 
        removeCommentById, 
        fetchCommentById, 
        fetchAllComments} = require('../models/comments.models');
const {fetchOneUser} = require('../models/users.models');

exports.postCommentByArticleId = (req, res, next) => {
    const articleId = req.params.article_id;
    const comment_username = req.body.username;
    const isArticleIdValid = fetchArticleById(articleId);   // promise to fetch article
    const isUserNameValid = fetchOneUser(comment_username)  // promise to fetch username
    const comment_body = req.body.body;

    return Promise.all([articleId, isArticleIdValid, isUserNameValid, comment_username, comment_body ])
            .then( ([articleId]) => {
                return insertCommentByArticleId(comment_username, comment_body, articleId);
            })
            .then((new_comment) => {
                res.status(201).send({new_comment});
            })
            .catch((err) => {
                next(err);
            });
};

exports.deleteCommentById = (req, res, next) => {
    const commentId = req.params.comment_id;
         return removeCommentById(commentId)
            .then((commentId) => {
                res.status(204).send({msg: `comment ${commentId} deleted`});
            })
            .catch((err) => {
                 next(err);
            });
};

exports.getAllComments = (req, res, next) => {
    fetchAllComments()
      .then((comments) => {
        res.status(200)
        res.send({comments});
    })
    .catch((err) => {
      next(err);
    })
  };