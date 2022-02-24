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
    console.log('In deleteCommentById',commentId);
  //  const isCommentIdValid = fetchCommentById(commentId);   // promise to fetch comment
    //const comment_body = req.body.body;

//    return Promise.all([commentId, isCommentIdValid])
 //           .then( ([commentId]) => {
 //               return removeCommentById(commentId);
//            })
        return removeCommentById(commentId)
            .then((commentId) => {
                res.status(204).send({msg: `comment ${commentId} deleted`});
            })
            .catch((err) => {
 //       console.log('the error object in promise.all ------',err);
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