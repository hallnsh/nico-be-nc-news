const db = require('../db/connection');

exports.fetchArticleById = (articleId) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`,
            [articleId])
    .then (({rows}) => {
        if (rows.length === 0) {
            // could check for a -ve id number and return status 422 and 
            // with message '-ve id value does not exist'
            return Promise.reject({status: 404, msg: 'Article does not exist'});
        }
        return rows[0];
    })
}

