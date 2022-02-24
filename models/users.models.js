const db = require('../db/connection');

//--------------------------------------------------------
exports.fetchUserNames = () => {
    return db
    .query('SELECT username FROM users;')
    .then (({rows}) => {
        return rows;
    });
};
//--------------------------------------------------------

exports.fetchOneUser = (username) => {
    return db
    .query(`SELECT * FROM users
            WHERE username = $1;`, [username])
    .then (({rows}) => {
        return rows[0];
    });
};
