const db = require('../db/connection');
const fs = require("fs/promises");

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
//--------------------------------------------------------
exports.fetchEndpointInfo = (fileName) => {
    return fs
      .readFile(`./${fileName}`, "utf-8")
      .then((endpointData) => {
            const jsonData = JSON.parse(endpointData);
            return jsonData;
      });
  }