const {fetchUserNames} = require('../models/users.models');

exports.getUsers = (req, res, next) => {
    fetchUserNames()
      .then((userNames) => {
        res.status(200)
        res.send({userNames});
    })
    .catch((err) => {
      next(err);
    })
  };