const db = require('../db/connection');
// run select query to get the list of topics
exports.fetchTopics = () => {
    return db
    .query('SELECT * FROM topics;')
    .then (({rows}) => {
        return rows;
    });
};