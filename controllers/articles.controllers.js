const {fetchArticleById, 
        updateArticleById, 
        fetchArticles, 
        fetchCommentCntByArticleId, 
        fetchCommentsByArticleId,
        fetchArticlesCommentCount,
        fetchFromArticlesByQuery} = require('../models/articles.models');
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

exports.getArticleById = (req, res, next) => {
    const articleId = req.params.article_id;

    fetchArticleById(articleId)
    .then((article) => {

      res.status(200);
      res.send({article});
    })
    .catch((err) => {
      next(err);
    })
  };
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

  exports.patchArticleById = (req, res, next) => {
    const articleId = req.params.article_id;
    const articleUpdate = req.body;
    
    updateArticleById(articleId, articleUpdate)
    .then((article) => {

      res.status(200);
      res.send({article});
    })
    .catch((err) => {
      next(err);
    })
  };
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

  exports.getArticles = (req, res, next) => {
    fetchArticles()
      .then((articles) => {
        res.status(200)
        res.send({articles});
    })
    .catch((err) => {
      next(err);
    })
  };
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

exports.getArticleCommentCount = (req, res, next) => {
      const articleId = req.params.article_id;

      fetchCommentCntByArticleId(articleId)
      .then((article) => {
  
        res.status(200);
        res.send({article});
      })
      .catch((err) => {
        next(err);
      })
};
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;

  fetchCommentsByArticleId(articleId)
  .then((commentsList) => {

    res.status(200);
    res.send({commentsList});
  })
  .catch((err) => {
    next(err);
  })
};
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

exports.getArticlesAndCommentCount = (req, res, next) => {

  fetchArticlesCommentCount()
  .then((articles) => {

    res.status(200);
    res.send({articles});
  })
  .catch((err) => {
    console.log(err);
    next(err);
  })
};
// ------------------------------------------------------------------
// extract the query parameters if there are any
// and create a simple query object to send to the
// model which will handle the SQL and database 
// ------------------------------------------------------------------

exports.getArticlesByQuery = (req, res, next) => {
const { query : queryContent } = req;

   fetchFromArticlesByQuery(queryContent)
  .then((articles) => {

    res.status(200);
    res.send({articles});
  })
  .catch((err) => {
 //   console.log('this is the error object',err);
    next(err);
  })
};