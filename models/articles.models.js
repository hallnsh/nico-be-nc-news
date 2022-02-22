const db = require('../db/connection');
// --------------------------------------------------------------------------------
//     Returns a single article from the articles table based on article_id
// --------------------------------------------------------------------------------
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
// -----------------------------------------------------------------------------------
// uses update query to increment (or decrement) the value of the votes count using
// the value in inc_votes passed in the articleUpdate object.
// -----------------------------------------------------------------------------------
exports.updateArticleById = (articleId, articleUpdate) => {
    const { inc_votes : voteIncrement} = articleUpdate;
    return db
    .query(`UPDATE articles 
            SET votes = votes + $1 
            WHERE article_id = $2 
            RETURNING *;`, [voteIncrement, articleId])
    .then (({rows}) => {
        if (rows.length === 0) {
            // could check for a -ve id number and return status 422 and 
            // with message '-ve id value does not exist'
            return Promise.reject({status: 404, msg: 'Article does not exist'});
        }

        return rows[0];
    })
}
//---------------------------------------------------------------------------------------
// Returns all the articles in the articles table in descending date order.
//
//---------------------------------------------------------------------------------------
exports.fetchArticles = () => {
    return db
    .query('SELECT * FROM articles ORDER BY created_at DESC;')
    .then (({rows}) => {
        return rows;
    });
};
//---------------------------------------------------------------------------------------
// Returns an article based an article_id along with the number of comments associated with
// that article.
//
// The comment count is returned as an integer.
// Based on the following SQL
// SELECT articles.*, COUNT(comments.article_id) AS comment_count 
// FROM articles 
// LEFT JOIN comments ON comments.article_id =articles.article_id 
// WHERE articles.article_id = articleId
// GROUP BY articles.article_id;
//----------------------------------------------------------------------------------------
exports.fetchCommentCntByArticleId = (articleId) => {
    return db
    .query(
        `SELECT articles.*, ( COUNT(comments.article_id) :: INTEGER) AS comment_count 
        FROM articles 
        LEFT JOIN comments ON comments.article_id = articles.article_id 
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,[articleId])
    .then (({rows}) => {
        if (rows.length === 0) {
            // could check for a -ve id number and return status 422 and 
            // with message '-ve id value does not exist'
            return Promise.reject({status: 404, msg: 'Article does not exist'});
        }
        return rows[0];
    })
}
//-------------------------------------------------------------------------------------------------
// This returns a list of all comments currently associated with an article identified by article_id
//
// based on the following SQL
// SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body
// FROM comments 
// LEFT JOIN articles ON comments.article_id = articles.article_id 
// WHERE articles.article_id = articleId
// GROUP BY comments.comment_id;
//-------------------------------------------------------------------------------------------------
exports.fetchCommentsByArticleId = (articleId) => {
    return db
    .query(
        `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body
        FROM comments 
        LEFT JOIN articles ON comments.article_id = articles.article_id 
        WHERE articles.article_id = $1
        GROUP BY comments.comment_id;`,[articleId])
    .then (({rows}) => {
        if (rows.length === 0) {
            // could check for a -ve id number and return status 422 and 
            // with message '-ve id value does not exist'
            return Promise.reject({status: 404, msg: 'Article does not exist'});
        }
        return rows;
    })
}

//-------------------------------------------------------------------------------------------------
// Extends functionality and returns a list of articles with an additional field to contain the
// count of comments associated with each article.
//
// based on the following SQL
// SELECT articles.*, ( COUNT(comments.article_id) :: INTEGER) AS comment_count 
// FROM articles 
// LEFT JOIN comments ON comments.article_id =articles.article_id 
// GROUP BY articles.article_id;
// 
//-------------------------------------------------------------------------------------------------

exports.fetchArticlesCommentCount = () => {
    return db
    .query(
            `SELECT articles.*, ( COUNT(comments.article_id) :: INTEGER) AS comment_count 
            FROM articles 
            LEFT JOIN comments ON comments.article_id =articles.article_id 
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;`)
    .then (({rows}) => {
        if (rows.length === 0) {
            // could check for a -ve id number and return status 422 and 
            // with message '-ve id value does not exist'
            return Promise.reject({status: 404, msg: 'Article does not exist'});
        }
        return rows;
    })
}
//-------------------------------------------------------------------------------------------------
// For the Get /api/articles/ (query)
//
//FEATURE REQUEST
// The end point should also accept the following queries:
//
// sort_by, which sorts the articles by any valid column (defaults to date)
// order, which can be set to asc or desc for ascending or descending (defaults to descending)
// topic, which filters the articles by the topic value specified in the query
//
// Takes an api query object containing sanitized query parameters
// uses the query parameters to create the appropriate query
// 
// If it exists the query is constructed here because the controllers don't know anything about SQL
//-------------------------------------------------------------------------------------------------

exports.fetchFromArticlesByQuery = (queryContent) => {
let sqlString = '';
const queryValues = [];

const {sort_by, order, topic} = queryContent;
 
const default_sort_by = 'created_at';
const default_order = 'DESC';
const default_topic = ``;
const queryPart1 = `SELECT articles.*, ( COUNT(comments.article_id) :: INTEGER) AS comment_count 
                                        FROM articles 
                                        LEFT JOIN comments ON comments.article_id =articles.article_id `;
let queryPart2 = ``;
const queryPart3 = `GROUP BY articles.article_id `;
let queryPart4 = `ORDER BY articles.`;
let sortBy = default_sort_by;
let orderBy = default_order;
let filterBy = default_topic;

const sort_by_greenList = [ 'article_id', 
                            'title', 
                            'topic', 
                            'author', 
                            'body', 
                            'created_at', 
                            'votes', 
                            'comment_count'];

const key_greenList = ['sort_by', 'order', 'topic'];
const order_greenList = ['desc', 'DESC', 'asc', 'ASC'];
const keys = Object.keys(queryContent);
let invalidKey = false;

    //console.log('fetchFromArticlesByQuery---------------',keys, keys.length,queryContent, sort_by, order);
    // if there are no query parameters then just go ahead and construct the default 
    // no user input style query, otherwise check for errors and reject with appropriate
    // message or if the query is valid construct the SQL and throw it to Postgres.
  
    // if the number of keys is > 0 then we either have to deal witha keys error or
    // fabricate a query if everyting is cool with the query.

    if (keys.length > 0){
        // if the number of keys is > 3 then there are just too many keys!
        if(keys.length > 3) {
            return Promise.reject({ status: 400, msg: 'Too many query keys' });
        }

        //check for invalid key in query
        keys.forEach( (key,i) => {if (!key_greenList.includes(key)) invalidKey = true; });
        if(invalidKey){
            return Promise.reject({ status: 400, msg: 'Attempt to query on Invalid key' });
        }
        
        // if it is not undefined check the sort_by key is allowed
        if (!sort_by_greenList.includes(sort_by) && sort_by !== undefined) {
            return Promise.reject({ status: 400, msg: 'Invalid sort query' });
        }
        // if it is not undefined check the order key is allowed
        if (!order_greenList.includes(order) && order != undefined) {
            return Promise.reject({ status: 400, msg: 'Invalid order query' });
        }

        // Build the query components and figure out which bits are left to default values, i.e. are
        // not included within the query on the IRL/URL line.

        // if (!topic_greenList.includes(order) && topic !== undefined) {
        //     return Promise.reject({ status: 400, msg: 'Invalid topic filter given' });
        // }

        if (topic === undefined) {
            queryPart2 = ``;
            filterBy = default_topic;
        }
        else {
            queryValues.push(topic);
            queryPart2 += ` WHERE articles.topic = $1`;
            filterBy = topic;
        }

        if (sort_by === undefined)
            sortBy = default_sort_by;
        else
            sortBy = sort_by;

        if(order === undefined)
            orderBy = default_order;
        else
            orderBy = order;
        
        // console.log(`---Raw Values---------------sort_by[${sort_by}] order[${order}] topic[${topic}]-------------\n` +
        //             `---Values in query----------sort_by[${sortBy}] order[${orderBy}] topic[${filterBy}]-------------\n` +
        //             `queryPart2[${queryPart2}]      queryValues = ${queryValues}`);
    }else {
        // there are no query parameters so create standard query string. Since
        // there is NO USER INPUT to this there is no possible SQL Injection;
      sortBy = default_sort_by;
      orderBy = default_order;
    }

    queryPart4 = `ORDER BY articles.${sortBy} ${orderBy};`;
    sqlString = queryPart1 + queryPart2 + queryPart3 + queryPart4;

    return db
        .query( sqlString, queryValues)
        .then (({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'No results found for that query'});
            }
            return rows;
        })

}
