const db = require('../db/connection');

exports.fetchCommentById = (commentId) => {
    return db
        .query(`SELECT * FROM comments
            WHERE comment_id = $1;`,[commentId])
        .then (({rows}) => {
   //         console.log('----------------------------------',rows[0]);
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'Comment not found'});
            }
            return rows[0];            
        })
}

exports.fetchAllComments = () => {
    return db
        .query(`SELECT * FROM comments RETURNING *;`)
        .then (({rows}) => {
   //         console.log('----------------------------------',rows);
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'Comment not found'});
            }
            return rows;            
        })
}
// You are only going to do this if the articleId has been resolved.
exports.insertCommentByArticleId = (comment_username, comment_body, articleId) => {
  
    return db
        .query(`INSERT INTO comments (author, body, article_id) 
                VALUES ($1, $2, $3) 
                RETURNING *;`,[comment_username, comment_body, articleId])
        .then (({rows}) => {
        
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'Nothing was inserted'});
            }
            return rows[0];
        })
}

exports.removeCommentById = (commentId) => {
  //console.log('comment to delete===========',commentId)
    return db
    .query(`DELETE FROM comments
            WHERE comment_id = $1
            RETURNING body AS deleted_entry;`,[commentId])
    .then (({rows}) => {
    
      // console.log('there is no such comment to delete');
         if (rows.length === 0) {
    //         console.log('there is no such comment to delete');
             return Promise.reject({status: 404, msg: 'comment does not exist'});
         }
        return rows[0];
    })
}
