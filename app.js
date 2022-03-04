const express = require('express');
const { getArticleById, 
        patchArticleById, 
        getArticles, 
        getArticleCommentCount, 
        getCommentsByArticleId,
        getArticlesAndCommentCount,
        getArticlesByQuery
        } = require('./controllers/articles.controllers');

const {getTopics} = require('./controllers/topics.controllers');
const {getUsers, getEndpointInfo} = require('./controllers/users.controllers');
const {postCommentByArticleId, deleteCommentById, getAllComments} = require('./controllers/comments.controllers')
const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);
//app.get('/api/articles/:article_id', getArticleById);     // superceded
app.patch('/api/articles/:article_id', patchArticleById);
app.get('/api/users', getUsers);
//app.get('/api/articles', getArticles);    // superceded
app.get('/api/articles/:article_id', getArticleCommentCount);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
//app.get('/api/articles', getArticlesAndCommentCount);   // superceded
app.post('/api/articles/:article_id/comments', postCommentByArticleId);
app.get('/api/articles', getArticlesByQuery);
app.delete('/api/comments/:comment_id', deleteCommentById);
app.get('/api', getEndpointInfo);

// this is the wild card app request, i.e. consider all
// requests with any possible endpoint.
app.all('/*', (req, res, next) => { 
 //   res.status(404).send({msg: 'path not found'});
    res.status(400).send({msg: 'bad request'});
});

// -------------------------------------------------------
// Insert these into seperate module called error.handlers
// -------------------------------------------------------
app.use((err, req, res, next) => {
    // destructure parts of the err object of interest
    const {status, msg} = err;      
    if(status) {
        res.status(status).send({msg});
    }else
    next(err);
});

app.use((err, req, res, next) => {
   
    const {status, msg, code} = err;      

    // In the case of a SQL error 22P02 this is an invalid id
    if(code === '23503') {
        res.status(400).send({msg: 'Violation (INVALID) username'});
    }

    if(code === '22P02') {
        res.status(400).send({msg: 'invalid id'});
    }else
    next(err);
});
    
app.use((err, req, res, next) => {
    // this is the catch all server error which there is no test for!
    res.status(500).send({msg: 'server error'});
});

module.exports = app;