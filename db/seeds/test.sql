\c nc_news_test;
/*
SELECT articles.*, ( COUNT(comments.article_id) :: INTEGER) AS comment_count 
FROM articles 
LEFT JOIN comments ON comments.article_id = articles.article_id 
WHERE articles.article_id = 1
GROUP BY articles.article_id;
*/

/*
SELECT articles.*, ( COUNT(comments.article_id) :: INTEGER) AS comment_count 
FROM articles 
LEFT JOIN comments ON comments.article_id =articles.article_id 
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;
*/

/*
comment_id
votes
created_at
author which is the username from the users table
body
*/


/*
SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body
FROM comments 
LEFT JOIN articles ON comments.article_id = articles.article_id 
WHERE articles.article_id = 1
GROUP BY comments.comment_id;
*/


SELECT * FROM comments;
/*
SELECT * FROM users
WHERE ;

SELECT * FROM topics;

SELECT * FROM articles;
*/

SELECT articles.*, ( COUNT(comments.article_id) :: INTEGER) AS comment_count 
FROM articles 
LEFT JOIN comments ON comments.article_id =articles.article_id
--WHERE articles.article_id = 8
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;

/*
INSERT INTO comments (author, body, article_id) 
VALUES ('butter_bridge','and I feel like a wanted man on sacred ground',7) 
RETURNING *;
*/
/*
INSERT INTO comments (author, body, article_id) 
VALUES ('butter_bridge','Rain beats on my window and the moon lights up the dark',6) 
RETURNING *;
*/
/*
INSERT INTO comments (author, body, article_id) 
VALUES ('butter_bridge','Tail lights on the highway, they dissapear from view',10) 
RETURNING *;
*/
SELECT * FROM comments
--WHERE comment_id = 2;
--RETURNING *;

/*
SELECT * FROM users
WHERE username = 'lurker';
*/
/*
DELETE FROM comments
WHERE comment_id = 5
RETURNING body AS deleted_entry;
*/

--SELECT articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, ( COUNT(comments.article_id) :: INTEGER) AS comment_count 
