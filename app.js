const express = require('express');
const {getTopics} = require('./controllers/topics.controllers');
const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);
//app.get('/api/articles/:article_id', getArticleById);
//app.patch('/api/articles/:article_id', patchArticleById);
//app.get('/api/users', getUsers);
//app.get('/api/articles', getArticles);
//app.get('/api/articles/:article_id/comments', getArticleCommentsByArticleId);

// this is the wild card app request, i.e. consider all
// requests with any possible endpoint.
app.all('/*', (req, res, next) => { 
    res.status(404).send({msg: 'path not found'});
});


// -------------------------------------------------------
// Insert these into seperate module called error.handlers
// -------------------------------------------------------
app.use((err, req, res, next) => {
    const {status, msg} = err;

    if(status) {
        res.status(status).send({msg});
    }else
    next(err);
});

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'server error'});
});

module.exports = app;